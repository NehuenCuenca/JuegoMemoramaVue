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
            columnas: 4,

            //!!AVISO!!: Si usted esta manipulando el num de filas y columnas, verificar que la multiplicacion de estas dos variables, de como resultado un numero PAR, por ejemplo el array de la linea de abajo:  
            // EJEMPLO arrayValores: [1,2,3,4,5,5,4,3,2,1]
            
            //Contador de clicks (+1 si revela una carta)
            contClicks: 0,
            //Contador de intentos (+1 si revelo 2 cartas)
            contIntentos: 0,

            //Array de los valores que seran presentados en las cartas
            arrValores: [],
            //Array de 2 valores clickeados
            arrValoresClickeados: [],

            cronometro: null,
            segundosIntento: 0,
            auxSegundos: null,

            //condicion sobre si el jugador empezó a jugar
            inicio: false,
            //condicion sobre si el jugador perdió
            perdio: false,
            //condicion de si el jugador ganó
            gano:false,

        }
    },

    methods: {

        //Metodo para crear un array de valores de un tamaño dinamico a las filas y columnas
        crearArrayValores(cantCartas){
            this.arrValores = [];
            let totalCartas= cantCartas;
            let mitadTotalCartas = (totalCartas/2);
            //Recorro la cantidad total de cartas
            for(let k=1; k < totalCartas; k++){
                //Guardo el indice para usarlo como valor despues
                let valor= k;
                //Pregunto si el indice que guarde es mayor a la mitad del total de cartas, 
                if(valor > (mitadTotalCartas)){
                    //Guardo como valor el total de cartas menos la posicion actual
                    valor = (totalCartas) - valor; 
                }
                //Agrego el indice al array de valores
                this.arrValores.push(String(valor));
            }
            //Devuelvo el array
            return this.arrValores
        },

        //Metodo que desordena el array de valores 
        desordenarArrValores(){
            let filas = this.filas;
            let columnas = this.columnas;
            let totalCartas= Number(filas*columnas);
            //creo el array de valores 
            let arrayValores= this.crearArrayValores(totalCartas+1);
            //Desordeno el array 
            let arrayDesordenado= arrayValores.sort(function(a,b){
                return String(Math.random() - 0.5);
            });
            return arrayDesordenado
        },

        cargarTablero() {
            this.auxSegundos=null;
            this.cronometro= null, 
            this.pararCronometro();
            this.inicio= false;
            this.perdio = false;
            this.gano= false;
            this.cartas = [];
            this.contIntentos = 0;
            this.contClicks = 0;

            let filas = this.filas;
            let columnas = this.columnas;
            let totalCartas= Number(filas*columnas);

            console.log("RECORDATORIO, podes sumar/restar las cartas a traves del codigo, cambiando el num de  filas y columnas...")
            console.log(`Array de valores creado..: [${this.crearArrayValores(totalCartas+1)}]`);

            //Desordeno el array de valores
            let valoresDesordenados= this.desordenarArrValores();
            console.log(`Array de valores desordenado..: [${valoresDesordenados}]`);

            //Creo las cartas
            for(let i=0; i < totalCartas; i++){
                //guardo el valor del primer elemento eliminado del array desordenado de valores
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

            /* for(let i=0; i < totalCartas; i++){
                if(){

                }
            } */
            
        },  

        //Metodo para contar los intentos (1 intento = 2 cartas reveladas que no son iguales)
        contarIntentos(contClicks){
            if(contClicks % 2 == 0){
                this.contIntentos++;
                console.log("Intentos: "+ this.contIntentos);
            }
        },

        //Metodo para mostrar el valor de la carta clickeada (dar vuelta una carta)
        revelarCarta(carta){
            if(!this.inicio){
                this.cronometro = setInterval(() => {
                    this.segundosIntento++;
                }, 1000);
            }
            this.inicio=true;

            if(!carta.revelada){  
                carta.revelada= true;
                this.contClicks++;
                this.guardarValores(carta);
                if(this.contClicks % 2 == 0){
                    //this.arrValoresClickeados
                    let intento= this.compararValores();
                    if(!intento){
                        this.contarIntentos(this.contClicks);
                    }
                }
            }
            
        },

        //Metodo que guarda en un array 2 valores clickeados
        guardarValores(carta){
            let valor = carta.valor;
            this.arrValoresClickeados.push(valor);
        },

        //Metodo que compara las 2 cartas que fueron clickeadas
        compararValores(){
            console.log("Valores clickeados: "+ this.arrValoresClickeados)
            if(this.arrValoresClickeados[0] == this.arrValoresClickeados[1]){
                this.arrValoresClickeados= [];
                console.log("Intento acertado");
                this.verificacionGano();
                return true
            } else {
                setTimeout(() => this.taparCartas(), 400); 
                console.log("Intento fallido");
                return false
            }
        },

        //metodo para tapar aquellas cartas que fueron clickeadas y no coincidian (intento fallido)
        taparCartas(){
            let filas = this.filas;
            let columnas = this.columnas;
            let totalCartas= Number(filas*columnas); 
            let valores= this.arrValoresClickeados;

            for(let i=0; i < totalCartas; i++){
                if((this.cartas[i].valor == valores[0]) || (this.cartas[i].valor == valores[1])){
                    this.cartas[i].revelada= false
                } else {
                    this.cartas[i].revelada
                }
            } 

            this.arrValoresClickeados= [];
            this.verificacionPerdio()
        },   
        
        //Meto para detener el cronometro
        pararCronometro(){
            clearInterval(this.cronometro);
        }, 
        
        //Metodo que verifica si el jugador supero un maximo de 12 intentos.
        verificacionPerdio(){
            if(this.contIntentos == 12){
                this.auxSegundos= this.segundosIntento;
                this.pararCronometro()
                this.segundosIntento=0;
                this.cronometro=null;
                this.gano=false;
                this.perdio= true;
                this.inicio= false;
                return
            }
        },

        //Metodo que cuenta todas las cartas reveladas y las compara con el total existente de cartas. Esta funcion se ejecuta cuando se verifica un intento.
        verificacionGano(){
            let filas = this.filas;
            let columnas = this.columnas;
            let totalCartas= Number(filas*columnas);
            let arrCartasAux = this.cartas.filter(carta => carta.revelada == true)
            console.log("Cantidad cartas reveladas: "+ arrCartasAux.length)

            if(arrCartasAux.length == totalCartas){
                this.auxSegundos= this.segundosIntento;
                this.pararCronometro();
                this.segundosIntento=0;
                this.cronometro=null;
                this.perdio=false;
                this.gano= true; 
                this.inicio= false;
            }
            return
        }

    },

    computed:{
        segundosCifras(){
            let cifras = this.segundosIntento.toString();
            
            if(cifras.length == 1){
                cifras = '00' + cifras;
            } else if(cifras.length == 2){
                cifras = '0' + cifras;
            }
            return cifras
        },
    },
});

