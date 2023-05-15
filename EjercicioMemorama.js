const carta = {
    props:['infoCarta'],
    
    template: "#carta-template",

    methods: {
        revelar(){
            this.$emit('onRevelar', this.infoCarta)
        },

    },

    computed: {
        valor(){
            if(this.infoCarta.revelada){
                return (''+ this.infoCarta.valor)
            } else {
                return ''
            }
        },
    },
}


const vm = new Vue({
    el: "#app",

    components: {
        carta,
    },

    template: "#tablero-template",

    created(){
        this.cargarTablero(); 
    },

    data(){
        return {
            //Array de las cartas
            cartas: [],

            //Filas y columnas del tablero
            filas: 4,
            columnas: 6,

            //!!AVISO!!: Si usted esta manipulando el num de filas y columnas, 
            //verificar que la multiplicacion de estas dos variables, de como resultado un numero PAR, 
            //por ejemplo el array de la linea de abajo:  
            // EJEMPLO arrayValores: [1,2,3,4,5,5,4,3,2,1]
            
            //const del limite de intentos que tiene el jugador
            limiteIntentos: 16,

            //Contador de intentos (+1 si revelo 2 cartas)
            contIntentos: 0,

            //Array de los valores que seran presentados en las cartas
            arrValores: [],

            cronometro: null,
            segundosIntento: 0,
            auxSegundos: null,

            //condicion sobre si el jugador empezó a jugar
            inicio: false,
            //condicion sobre si el jugador perdió
            perdio: false,
            //condicion de si el jugador ganó
            gano:false,

            //vars nuevas
            cartaAux: null,
        }
    },

    methods: {
        //Metodo para crear un array de valores de un tamaño dinamico a las filas y columnas
        crearArrayValores(cantCartas){
            this.arrValores = [];
            let totalCartas= cantCartas;
            let mitadTotalCartas = (totalCartas/2);
            //Recorro la mitad de las cartas
            for(let k=1; k < mitadTotalCartas+1; k++){
                //Agrego el indice al array de valores
                this.arrValores.push(String(k));
            }
            //Duplico los valores y guardo
            this.arrValores= this.arrValores.concat(this.arrValores)

            return this.arrValores
        },

        //Metodo que desordena el array de valores 
        desordenarArrValores(array){
            //Desordeno el array 
            let arrayDesordenado= array.sort(function(a,b){
                return String(Math.random() - 0.5);
            });
            
            return arrayDesordenado
        },

        cargarTablero() {
            this.segundosIntento= 0;
            this.auxSegundos= 0;
            this.cronometro= null, 
            this.pararCronometro();
            this.inicio= false;
            this.perdio = false;
            this.gano= false;
            this.cartas = [];
            this.contIntentos = 0;
            this.cartaAux = null

            let filas = this.filas;
            let columnas = this.columnas;
            let totalCartas= Number(filas*columnas);
            let arrCartas = this.crearArrayValores(totalCartas)

            //Desordeno el array de valores
            let valoresDesordenados= this.desordenarArrValores(arrCartas);

            //Creo las cartas
            for(let i=0; i < totalCartas; i++){
                //guardo el primer elemento eliminadolo del array desordenado de valores
                let valorRandom= String(valoresDesordenados.shift());    
                let carta = {
                    valor: valorRandom,
                    revelada: false,
                    fila: Math.floor(i / columnas) + 1,
                    columna: (i % columnas) + 1,
                }
                //Agrego la carta al array de cartas
                this.cartas.push(carta);
            } 
            console.log("Cartas creadas..")
        },  

        //Metodo para mostrar el valor de la carta clickeada (dar vuelta una carta)
        revelarCarta(cartaActual){
            this.mostrarCarta(cartaActual)

            if(this.cartaAux === null){
                this.cartaAux = cartaActual
            } else {
                if(!this.inicio){
                    this.cronometro = setInterval(() => {
                        this.segundosIntento++;
                    }, 1000);
                }
                this.inicio = true;

                if(this.cartaAux === cartaActual) {
                    return;
                }
                
                if(cartaActual.valor !== this.cartaAux.valor){
                    //Aumento intentos +1
                    this.contIntentos++;
                    //Tapo el par de cartas seleccionadas
                    let cartaAux= this.cartaAux
                    setTimeout(() => this.taparCarta(cartaAux), 400);
                    setTimeout(() => this.taparCarta(cartaActual), 400);
                }

                if(!this.verificacionPerdio()){
                    this.verificacionGano()
                }

                this.cartaAux = null
            }    
        },

        mostrarCarta(carta){
            carta.revelada = true
        },

        //metodo para tapar una carta
        taparCarta(carta){
            carta.revelada= false
        },
        
        //Metodo para detener el cronometro
        pararCronometro(){
            clearInterval(this.cronometro);
            this.auxSegundos= this.segundosIntento;
            this.cronometro=null;
        }, 
        
        //Metodo que verifica si el jugador supero un maximo de intentos.
        verificacionPerdio(){
            if(this.contIntentos == this.limiteIntentos){
                this.pararCronometro()
                this.gano=false;
                this.perdio= true;
                this.inicio= false;
                return true
            } else {
                return false
            }
        },

        //Metodo que cuenta todas las cartas reveladas y las compara con el total existente de cartas. Esta funcion se ejecuta cuando se verifica un intento.
        verificacionGano(){
            let arrCartasAux = this.cartas.filter(carta => carta.revelada == true)
            //console.log("Cantidad cartas reveladas: "+ arrCartasAux.length)

            if(arrCartasAux.length == this.cartas.length){
                this.pararCronometro();
                this.perdio=false;
                this.gano= true; 
                this.inicio= false;
                return true
            } else {
                return false
            }
        }

    },

    computed:{
        segundosCifras(){
            let cifras = this.segundosIntento.toString() ;
            
            if(cifras.length == 1){
                cifras = '00' + cifras;
            } else if(cifras.length == 2){
                cifras = '0' + cifras;
            }
            return cifras
        },
    },
});

