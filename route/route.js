module.exports = app => {
  
    const controller = require("../controllers/controller.js");
    
    var router = require("express").Router()
    
    router.get("/", controller.findall)
    router.get("/thehackernews", controller.findthehackernews)
    router.get("/cnbc", controller.findcnbc)
    router.get("/nytimes", controller.findnytimes)
    router.get("/france24", controller.findfrance24)
    router.get("/cyberwire", controller.findcyberwire)
    router.get("/channelnewsasia", controller.findchannelnewsasia)
    router.post("/registar", controller.registar);
    router.post("/login", controller.login);  
    router.get("/auth/confirm/:confirmationCode", controller.verificaUtilizador);  

    app.use('/news', router);
    
    };

