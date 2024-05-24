const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://jvictor200408:mGTCPWuxVBXzqWf0@cluster0.xzdkqvp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then( () => {console.log("Banco de dados conectado");}) 
.catch( (error) => {console.log("Erro ao conectar o Banco de Dados:", error);});

// Definir o schema
const lojaSchema = new mongoose.Schema({
    name: String
});

// Definir o modelo
const Loja = mongoose.model('Loja', lojaSchema);

// Middleware para obter uma loja pelo ID
async function getLoja(req, res, next) {
    let loja;
    try {
        loja = await Loja.findById(req.params.id);
        if (loja == null) {
            return res.status(404).json({ message: 'Loja não encontrada' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.loja = loja;
    next();
}

// Retorna todas as lojas
app.get('/lojas', async (req, res) => {
    try {
        const lojas = await Loja.find();
        res.json(lojas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Retorna uma loja
app.get('/lojas/:id', getLoja, (req, res) => {
    res.json(res.loja);
});

// Criar uma nova loja
app.post('/lojas', async (req, res) => {
    const loja = new Loja({
        name: req.body.name
    });

    try {
        const newLoja = await loja.save();
        res.status(201).json(newLoja);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Atualiza o nome da loja
app.put('/lojas/:id', getLoja, async (req, res) => {
    if (req.body.name != null) {
        res.loja.name = req.body.name;
    }

    try {
        const updatedLoja = await res.loja.save();
        res.json(updatedLoja);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Deletar uma loja
app.delete('/lojas/:id', getLoja, async (req, res) => {
    try {
        await res.loja.remove();
        res.json({ message: 'Loja deletada com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
