require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const { Server } = require('socket.io');
const Document = require('./models/Document');
const Annotation = require('./models/Annotation');
const { extractTextFromPDF } = require('./utils/pdfExtract');
const app = express();
const path = require('path');
// app.use(cors());
app.use(express.json());
const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: '*' } });
const io = new Server(server, {
    cors: {
        // origin: "*",
        origin: "https://demo-project-1-vdew.onrender.com",
        methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    },
});
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 4000;
// const MONGO = process.env.MONGO_URI || 'mongodb+srv://boopathiboo647_db_user:Boopathi4838@cluster0.tigfjii.mongodb.net/Sample';
const MONGO = 'mongodb+srv://boopathiboo647_db_user:Boopathi4838@cluster0.tigfjii.mongodb.net/Sample?retryWrites=true&w=majority';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Mongo connected'))
    .catch(err => console.error(" error ", err, "MONGO", MONGO));
io.on('connection', (socket) => {
    console.log('socket connected', socket.id);
    socket.on('joinDoc', ({ docId }) => {
        socket.join(`doc:${docId}`);
        console.log(socket.id, 'joined', `doc:${docId}`);
    });
    socket.on('leaveDoc', ({ docId }) => {
        socket.leave(`doc:${docId}`);
    });
    socket.on('disconnect', () => {
        // console.log('disconnect', socket.id);
    });
});

app.use(express.static(path.join(__dirname, "../client/dist")));



app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from backend!" });
});

app.get('/api/docs', async (req, res) => {
    try {
        const docs = await Document.find().sort({ createdAt: -1 }).lean();
        res.json(docs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'server error' });
    }
});

// Delete document
app.delete('/api/docs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Document.findByIdAndDelete(id);
        await Annotation.deleteMany({ docId: id });
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'server error' });
    }
});

// Upload document (text or PDF)
app.post('/api/docs/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: 'No file uploaded' });
        const mime = file.mimetype;
        let extractedText = '';
        if (mime === 'application/pdf') {
            extractedText = await extractTextFromPDF(file.buffer);
        } else {
            extractedText = file.buffer.toString('utf8');
        }
        const doc = await Document.create({
            title: req.body.title || file.originalname,
            mimeType: mime,
            extractedText,
            size: file.size
        });
        return res.json(doc);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'upload error' });
    }
});
// Get document
app.get('/api/docs/:docId', async (req, res) => {
    try {
        const doc = await Document.findById(req.params.docId).lean();
        if (!doc) return res.status(404).json({ message: 'Not found' });
        return res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'server error' });
    }
});
// Get annotations (optionally by range)
app.get('/api/docs/:docId/annotations', async (req, res) => {
    try {
        const { docId } = req.params;
        const anns = await Annotation.find({ docId }).sort({
            start:
                1
        }).lean().limit(5000);
        // send lightweight projection
        const lightweight = anns.map(a => ({
            _id: a._id, start: a.start, end:
                a.end, userId: a.userId, createdAt: a.createdAt
        }))
        res.json(lightweight);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'server error' });
    }
});
// Create annotation
app.post('/api/docs/:docId/annotations', async (req, res) => {
    try {
        const { docId } = req.params;
        const { start, end, comment, userId } = req.body;

        if (typeof start !== 'number' || typeof end !== 'number') {
            return res.status(400).json({ message: 'invalid range' });
        }

        const rangeHash = crypto.createHash('sha256')
            .update(`${docId}|${start}|${end}|${userId || 'anon'}`)
            .digest('hex');

        const existing = await Annotation.findOne({ rangeHash });
        if (existing) return res.status(409).json({ message: 'duplicate' });

        const doc = await Document.findById(docId);
        if (!doc) return res.status(404).json({ message: 'doc not found' });

        const contextBefore = doc.extractedText.slice(Math.max(0, start - 30), start);
        const contextAfter = doc.extractedText.slice(end, Math.min(doc.extractedText.length, end + 30));

        const ann = await Annotation.create({
            docId, userId: userId || null, start, end, comment: comment || '',
            contextBefore, contextAfter, rangeHash
        });

        const payload = {
            _id: ann._id, start: ann.start, end: ann.end, userId: ann.userId, createdAt: ann.createdAt
        };

        io.to(`doc:${docId}`).emit('annotation:created', payload);
        return res.json(payload);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'server error' });
    }
});

// Simple delete
app.delete('/api/annotations/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const ann = await Annotation.findByIdAndDelete(id);
        if (!ann) return res.status(404).json({ message: 'not found' });
        io.to(`doc:${ann.docId}`).emit('annotation:deleted', { _id: ann._id });
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'server error' });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

server.listen(PORT, () => console.log('Server running on', PORT));
