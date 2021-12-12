const axios = require('axios')
const cheerio = require('cheerio')

exports.findall = (req, res) => {
    const articles = []

    dataGet()

    async function dataGet() {

        const newspapers = ['thehackernews', 'cnbc', 'nytimes', 'france24', 'cyberwire', 'chanelnewsasia']
        const newspapersUrl = ['https://thehackernews.com/search/label/Cyber%20Attack', 'https://www.cnbc.com/cybersecurity/', 'https://www.nytimes.com/spotlight/cybersecurity', 'https://www.france24.com/en/tag/cyber-security/', 'https://thecyberwire.com/', 'https://www.channelnewsasia.com/topic/cybersecurity']
        const base = ['', '', 'https://www.nytimes.com', 'https://www.france24.com', 'https://thecyberwire.com', 'https://www.channelnewsasia.com']
        id = 0;

        for (const newspaperUrl of newspapersUrl) {
            await axios.get(newspaperUrl)
                .then((response) => {
                    const html = response.data
                    const $ = cheerio.load(html)

                    $('a:contains("cyber")', html).each(function () {
                        const title = $(this).text()
                        const url = $(this).attr('href')
                        articles.push({
                            title,
                            url: base[id] + url,
                            source: newspapers[id]
                        })
                    })
                })
            id += 1
        }

        res.json(articles)
    }
};

exports.findthehackernews = (req, res) => {
    const articles = []

    datathehackernews()

    async function datathehackernews() {
        await axios.get("https://thehackernews.com/search/label/Cyber%20Attack")
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)

                $('a:contains("cyber")', html).each(function () {
                    const title = $(this).text()
                    const url = $(this).attr('href')

                    articles.push({
                        title,
                        url,
                        source: "thehackernews"
                    })
                })

            })
        res.json(articles)
    }
}

exports.findcnbc= (req, res) => {
    const articles = []

    datacnbc()

    async function datacnbc() {
        await axios.get("https://www.cnbc.com/cybersecurity/")
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)

                $('a:contains("cyber")', html).each(function () {
                    const title = $(this).text()
                    const url = $(this).attr('href')

                    articles.push({
                        title,
                        url,
                        source: "cnbc"
                    })
                })

            })
        res.json(articles)
    }
}

exports.findnytimes = (req, res) => {
    const articles = []

    datanytimes()

    async function datanytimes() {
        await axios.get("https://www.nytimes.com/spotlight/cybersecurity")
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)

                $('a:contains("cyber")', html).each(function () {
                    const title = $(this).text()
                    const url = $(this).attr('href')

                    articles.push({
                        title,
                        url: "https://www.nytimes.com" + url,
                        source: "nytimes"
                    })
                })

            })
        res.json(articles)
    }
}

exports.findfrance24 = (req, res) => {
    const articles = []

    datafrance24()

    async function datafrance24() {
        await axios.get("https://www.france24.com/en/tag/cyber-security/")
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)

                $('a:contains("cyber")', html).each(function () {
                    const title = $(this).text()
                    const url = $(this).attr('href')

                    articles.push({
                        title,
                        url: 'https://www.france24.com' + url,
                        source: "france24"
                    })
                })

            })
        res.json(articles)
    }
}

exports.findcyberwire = (req, res) => {
    const articles = []

    datacyberwire()

    async function datacyberwire() {
        await axios.get("https://thecyberwire.com/")
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)

                $('a:contains("Cyber")', html).each(function () {
                    const title = $(this).text()
                    const url = $(this).attr('href')

                    articles.push({
                        title,
                        url: 'https://thecyberwire.com/' + url,
                        source: "cyberwire"
                    })
                })

            })
        res.json(articles)
    }
}

exports.findchannelnewsasia = (req, res) => {
    const articles = []

    datachannelnewsasia()

    async function datachannelnewsasia() {
        await axios.get("https://www.channelnewsasia.com/topic/cybersecurity")
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)

                $('a:contains("cyber")', html).each(function () {
                    const title = $(this).text()
                    const url = $(this).attr('href')

                    articles.push({
                        title,
                        url: 'https://www.channelnewsasia.com/' + url,
                        source: "channelnewsasia"
                    })
                })

            })
        res.json(articles)
    }
}

require("dotenv").config();

const db = require("../models/nedb"); // Define o MODEL que vamos usar
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res) {
    console.log("A autorizar...");
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        console.log("Token nula");
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.email = user;
    });
}

const nodemailer = require("nodemailer");
const { response } = require("express");

// async..await não é permitido no contexto global
async function enviaEmail(recipients, confirmationToken) {
    // Gera uma conta do serviço SMTP de email do domínio ethereal.email
    // Somente necessário na fase de testes e se não tiver uma conta real para utilizar
    let testAccount = await nodemailer.createTestAccount();

    // Cria um objeto transporter reutilizável que é um transporter SMTP
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true para 465, false para outras portas
        auth: {
            user: testAccount.user, // utilizador ethereal gerado
            pass: testAccount.pass, // senha do utilizador ethereal
        },
    });

    // envia o email usando o objeto de transporte definido
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // endereço do originador
        to: recipients, // lista de destinatários
        subject: "Hello ✔", // assunto
        text: "Clique aqui para ativar sua conta: " + confirmationToken, // corpo do email
        html: "<b>Clique aqui para ativar sua conta: " + confirmationToken + "</b>", // corpo do email em html
    });

    console.log("Mensagem enviada: %s", info.messageId);
    // Mensagem enviada: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // A pré-visualização só estará disponível se usar uma conta Ethereal para envio
    console.log(
        "URL para visualização prévia: %s",
        nodemailer.getTestMessageUrl(info)
    );
    // URL para visualização prévia: https://ethereal.email/message/WaQKMgKddxQDoou...
}

exports.verificaUtilizador = async (req, res) => {
    const confirmationCode = req.params.confirmationCode;
    db.crUd_ativar(confirmationCode);
    const resposta = { message: "O utilizador está ativo!" };
    console.log(resposta);
    return res.send(resposta);
};

// REGISTAR - cria um novo utilizador
exports.registar = async (req, res) => {
    console.log("Registar novo utilizador");
    if (!req.body) {
        return res.status(400).send({
            message: "O conteúdo não pode ser vazio!",
        });
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const email = req.body.email;
    const password = hashPassword;
    const confirmationToken = jwt.sign(
        req.body.email,
        process.env.ACCESS_TOKEN_SECRET
    );
    const confirmURL = `http://localhost:${process.env.PORT}/news/auth/confirm/${confirmationToken}`
    db.Crud_registar(email, password, confirmationToken) // C: Create
        .then((dados) => {
            enviaEmail(email, confirmURL).catch(console.error);
            res.status(201).send({
                message:
                    "Utilizador criado com sucesso, confira sua caixa de correio para ativar!",
            });
            console.log("Controller - utilizador registado: ");
            console.log(JSON.stringify(dados)); // para debug
        })
        .catch((response) => {
            console.log("controller - registar:");
            console.log(response);
            return res.status(400).send(response);
        });
};

// LOGIN - autentica um utilizador
exports.login = async (req, res) => {
    console.log("Autenticação de um utilizador");
    if (!req.body) {
        return res.status(400).send({
            message: "O conteúdo não pode ser vazio!",
        });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const email = req.body.email;
    const password = hashPassword;
    db.cRud_login(email) //
        .then(async (dados) => {
            if (await bcrypt.compare(req.body.password, dados.password)) {
                const user = { name: email };
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                res.json({ accessToken: accessToken }); // aqui temos de enviar a token de autorização
                console.log("Resposta da consulta à base de dados: ");
                console.log(JSON.stringify(dados)); // para debug
            } else {
                console.log("Password incorreta");
                return res.status(401).send({ erro: "A senha não está correta!" });
            }
        })
        .catch((response) => {
            console.log("controller:");
            console.log(response);
            return res.status(400).send(response);
        });
};
