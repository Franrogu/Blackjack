const miModulo=(()=>{
'use strict'

    let deck=[];

    const   tipos=['C','D','H','S'],
            figuras=['A','J','Q','K'];

    let puntosJugadores=[];

    //Referencias al HTML
    const   btnPedir = document.querySelector('#btnPedir'),
            btnDetener = document.querySelector('#btnDetener'),
            btnNuevo = document.querySelector('#btnNuevo');


    const   puntosHTML = document.querySelectorAll('small'),
            divCartasJugadores = document.querySelectorAll('.divCartas');
            


    //Inicializamos deck
        const inicializarJuego = (numJugadores=2)=>{
            deck = crearDeck();
            puntosJugadores=[];
            for(let i=0; i<numJugadores;i++ ){
                puntosJugadores.push(0);
            }

            puntosHTML.forEach(elem=>elem.innerText=0);
            divCartasJugadores.forEach(elem=>elem.innerHTML='');
            btnPedir.disabled = false;
            btnDetener.disabled = false; 
        }

    //Se crea una deck barajeado 
    const crearDeck = () =>{
        deck = [];
        for(let i=2; i<=10; i++){
            for(let tipo of tipos){         //Con el for of, se ejecuta el push en este caso 10 veces por cada 
                deck.push(i+tipo);          //uno de los elementos del arreglo, 2C, 2D, 2H, 2S - 3C, 3D, 3H, 3S
            }
        }

        for(let tipo of tipos){
            for(let figura of figuras){         
                deck.push(figura+tipo);          
            }
        }
        
        return _.shuffle(deck);
    }


    //Podremos pedir carta

    const pedirCarta=()=>{
        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }


    const valorCarta=(carta)=>{
        const valor = carta.substring(0, carta.length-1) 
        return  ( isNaN(valor) ) ? 
                (valor === 'A' ) ? 11 : 10 
                :valor*1; 
    }



    //Acumular puntos, 0 = primer jugador, ultimo turno: computadora
    const acumularPuntos=(carta,turno)=>{
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno]; 
        return puntosJugadores[turno];
    }



    const crearCarta=(carta,turno)=>{
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/img/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador=()=>{
        const[puntosMinimos, puntosComputadora]=puntosJugadores;

        setTimeout(()=>{
    
            if(puntosComputadora===puntosMinimos){
                alert('Nadie gana');
            }
            else if ((puntosMinimos>21)) {
                alert('Computadora Gana');
            } else if(puntosComputadora>21){
                alert('Jugador Gana');
            }else {
                alert('La computadora Gana');
            }
        },100);
    }

    //Turno de la Computadora

    const turnoComputadora = (puntosMinimos)=> {
        let puntosComputadora=0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta,puntosJugadores.length-1);
            crearCarta(carta,puntosJugadores.length-1);
        } while ( (puntosComputadora<puntosMinimos) && (puntosMinimos<=21) );
        
        determinarGanador();
    }

    //Eventos
    btnPedir.addEventListener('click', ()=>{
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta,0);

        crearCarta(carta,0);
        
        if ( puntosJugador>21 ) {
            console.warn('Perdiste'); 
            btnPedir.disabled = true;  
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador)
        } else if(puntosJugador===21){
            console.warn('Ganaste');  
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador)
        }  
    });


    btnDetener.addEventListener('click', ()=>{
        btnPedir.disabled = true;  
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });


    
    btnNuevo.addEventListener('click',()=>{
        
        inicializarJuego();
        
    });

    return{
        nuevoJuego: inicializarJuego
    };
})();
