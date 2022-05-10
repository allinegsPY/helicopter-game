function start() {
    $('#start').hide();

    $('#backgroundGame').append("<div id='Player' class='animationPlayer'></div>");
    $("#backgroundGame").append("<div id='Enemy1' class='animationEnemy'></div>");
    $("#backgroundGame").append("<div id='Enemy2'></div>");
    $("#backgroundGame").append("<div id='Friend' class='animationFriend'></div>");
    $("#backgroundGame").append("<div id='placar'></div>");
    $("#backgroundGame").append("<div id='energia'></div>");
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    //Variaveis do jogo

    var game = {};
    var keyboard = {
        W: 87,
        S: 83,
        D: 68
    };
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var podeAtirar = true;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;
    

    //Fim das variaveis do jogo

    game.pressionou = [];

    $(document).keydown(function (e) {
        game.pressionou[e.which] = true;
    })
    $(document).keyup(function (e) {
        game.pressionou[e.which] = false;
    })

    game.timer = setInterval(loop, 30);

    function loop() {
        movebackground();
        movePlayer();
        moveEnemyHelico();
        moveEnemyTruck();
        moveFriend();
        colisao();
        placar();
        energia();
        musica.addEventListener("ended", function () { musica.currentTime = 0; musica.play(); }, false);
        musica.play();

    }

    function movebackground() {
        left = parseInt($("#backgroundGame").css("background-position"));
        $("#backgroundGame").css("background-position", left - 1);

    }
    function movePlayer() {
        if (game.pressionou[keyboard.W]) {
            var top = parseInt($("#Player").css("top"));
            $("#Player").css("top", top - 10);
            if (top <= 0) {
                $("#Player").css("top", top + 10);
            }
        }
        if (game.pressionou[keyboard.S]) {
            var down = parseInt($("#Player").css("top"));
            $("#Player").css("top", down + 10);
            if (down >= 434) {
                $("#Player").css("top", down - 10);
            }
        }
        if (game.pressionou[keyboard.D]) {
            disparo();
        }
    }

    function moveEnemyHelico() {
        posicaoX = parseInt($("#Enemy1").css("left"));
        $("#Enemy1").css("left", posicaoX - velocidade);
        $("#Enemy1").css("top", posicaoY);

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#Enemy1").css("left", 694);
            $("#Enemy1").css("top", posicaoY);
        }

    }
    function moveEnemyTruck() {
        posicaoX = parseInt($("#Enemy2").css("left"));
        $("#Enemy2").css("left", posicaoX - 3);


        if (posicaoX <= 0) {
            $("#Enemy2").css("left", 775);

        }

    }
    function moveFriend() {

        posicaoXFriend = parseInt($("#Friend").css("left"));
        $("#Friend").css("left", posicaoXFriend + 1);

        if (posicaoXFriend > 906) {

            $("#Friend").css("left", 0);

        }

    }
    function disparo() {

        if (podeAtirar == true) {

            podeAtirar = false;

            topo = parseInt($("#Player").css("top"))
            posicaoX = parseInt($("#Player").css("left"))
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#backgroundGame").append("<div id='shot'></div");
            $("#shot").css("top", topoTiro);
            $("#shot").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 30);
            somDisparo.play();

        }

        function executaDisparo() {
            posicaoX = parseInt($("#shot").css("left"));
            $("#shot").css("left", posicaoX + 30);

            if (posicaoX > 900) {

                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#shot").remove();
                podeAtirar = true;

            }
        }
    }
    function colisao() {
        var colisao1 = ($("#Player").collision($("#Enemy1")));
        var colisao2 = ($("#Player").collision($("#Enemy2")));
        var colisao3 = ($("#shot").collision($("#Enemy1")));
        var colisao4 = ($("#shot").collision($("#Enemy2")));
        var colisao5 = ($("#Player").collision($("#Friend")));
        var colisao6 = ($("#Enemy2").collision($("#Friend")));

        if (colisao1.length > 0) {
            energiaAtual--;
            somExplosao.play();
            inimigo1X = parseInt($("#Enemy1").css("left"));
            inimigo1Y = parseInt($("#Enemy1").css("top"));
            explosao2(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#Enemy1").css("left", 694);
            $("#Enemy1").css("top", posicaoY);
        }

        if (colisao2.length > 0) {
            energiaAtual--;
            somExplosao.play();
            inimigo2X = parseInt($("#Enemy2").css("left"));
            inimigo2Y = parseInt($("#Enemy2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#Enemy2").remove();

            reposicionaInimigo2();
        }

        if (colisao3.length > 0) {

            pontos = pontos + 100;
            velocidade = velocidade + 0.3;
            inimigo1X = parseInt($("#Enemy1").css("left"));
            inimigo1Y = parseInt($("#Enemy1").css("top"));

            explosao2(inimigo1X, inimigo1Y);
            $("#shot").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#Enemy1").css("left", 694);
            $("#Enemy1").css("top", posicaoY);

        }

        if (colisao4.length > 0) {
            pontos = pontos + 50;
            inimigo2X = parseInt($("#Enemy2").css("left"));
            inimigo2Y = parseInt($("#Enemy2").css("top"));
            $("#Enemy2").remove();

            explosao2(inimigo2X, inimigo2Y);
            $("#shot").css("left", 950);

            reposicionaInimigo2();

        }

        if (colisao5.length > 0) {
            salvos++;
            somResgate.play();
            reposicionaAmigo();
            $("#Friend").remove();
        }

        if (colisao6.length > 0) {
            perdidos++;
            somPerdido.play();
            amigoX = parseInt($("#Friend").css("left"));
            amigoY = parseInt($("#Friend").css("top"));
            explosao3(amigoX, amigoY);
            $("#Friend").remove();

            reposicionaAmigo();

        }


    }

    function reposicionaInimigo2() {

        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimdejogo == false) {

                $("#backgroundGame").append("<div id='Enemy2'></div>");

            }

        }
    }

    function explosao2(inimigo2X, inimigo2Y) {

        $("#backgroundGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2() {

            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;

        }

    }
    function explosao3(amigoX, amigoY) {
        $("#backgroundGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;

        }

    }


    function reposicionaAmigo() {

        var tempoAmigo = window.setInterval(reposiciona6, 6000);

        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (fimdejogo == false) {

                $("#backgroundGame").append("<div id='Friend' class='animationFriend'></div>");

            }

        }

    }

    function placar() {

        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");

    }

    function energia() {

        if (energiaAtual == 3) {

            $("#energia").css("background-image", "url(imgs/energia3.png)");
        }

        if (energiaAtual == 2) {

            $("#energia").css("background-image", "url(imgs/energia2.png)");
        }

        if (energiaAtual == 1) {

            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }

        if (energiaAtual == 0) {

            $("#energia").css("background-image", "url(imgs/energia0.png)");
            gameOver();

        }

    }

    function gameOver() {
        fimdejogo = true;
        
        somGameover.play();

        window.clearInterval(game.timer);
        game.timer = null;
        musica.pause();

        $("#Player").remove();
        $("#Enemy1").remove();
        $("#Enemy2").remove();
        $("#Friend").remove();

        $("#backgroundGame").append("<div id='fim'></div>");

        $("#fim").html("<h1> Game Over </h1>" + "<p>Sua pontuação foi: " + pontos + "</p>" + "<button id='reinicia' onClick=reiniciaJogo()>Jogar Novamente</button>");
    }


}

function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
	
}

