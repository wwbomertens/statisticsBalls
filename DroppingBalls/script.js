//Knop is ingedrukt
function knopIndrukken(){
    knopIngedrukt=1;
    aantalBallen=document.getElementById("aantalBallen").value;
    grens=document.getElementById("kans").value;
    tellingBallen=0;
    ballenArray=[];
    maakBal();
    d= new Date();
    startTijd=d.getTime()
    ballenEind=[];
    tikkenTeller=0;
    tekstGem="";
    tekstAfw="";
}

// Dit wordt in het begin 1x uitgevoerd
function setup() {

    tekstBovenaan = 'Statistics in Javascript'
    knopIngedrukt=0;
    ondergrens=200;
    // Maak het "schildersdoek" ("canvas") waarop we gaan tekenen
    createCanvas(windowWidth, windowHeight)
    angleMode(DEGREES) // hoeken in graden
    tellerPunt=0;
    maxRijen=6;
    start=50;
    xAfstand=20;
    aantalBallen=400;
    tellingBallen=0;
    ballenArray=[];
    maakBal();
    d= new Date();
    startTijd=d.getTime()
    console.log(startTijd);
    tikkenTeller=0;
    ballenEind=[];
    afwijking=6;
    snelheid=5;
    verschilTijd=75;
    grootteBal=3;

} // einde van setup()
//--------------------------------------------------------------------

function maakBal(){
    b=new ballDrop(0,5,windowWidth/2)
    ballenArray.push(b);
    tellingBallen++;
    balX=windowWidth/2;
    balY=5;

}

    
  // Dit wordt steeds opnieuw uitgevoerd
  function draw() {
    if (knopIngedrukt==1){
        background("white");
        // Tekst bovenin
       
        
        tekenGrid();
    
        for(i=0;i<ballenArray.length;i++){
            c=ballenArray[i];
    
            if (checkEind(c) & c.eind==0) {
                verplaatsBal(c);
            }else if(c.eind==0){
                c.eind=1;
                ballenEind.push(c.x);
                calculateStats();
            
            }
            tekenBal(c.x, c.y)
        }

        noStroke()
        fill('black')
        textSize(24)            
        text(tekstGem, windowWidth-400, 30)
        text(tekstAfw, windowWidth-400, 60)

        d=new Date();
        //Nieuwe tijd
        nieuweTijd=d.getTime()
        
        verschil=nieuweTijd-startTijd;
        
        if (verschil>=verschilTijd*(1+tikkenTeller)){
            if (tellingBallen<aantalBallen){
                b=new ballDrop(0,5,windowWidth/2)
                ballenArray.push(b);
                tellingBallen++;
            }
            tikkenTeller++;
        }

    }




  
  } // einde van draw()
  
  //--------------------------------------------------------------------
  function calculateStats(){
    var lengte;
    var sum=0;
    var average;
    var afwijkingSTDEV;
    var stdev;

    for(var i=0;i<ballenEind.length;i++){
        lengte=ballenEind[i]-windowWidth/2
        lengte=lengte/afwijking
        sum+=lengte;
    }

    average=Math.round(sum/ballenEind.length*100)/100;
    sum=0;
    for(var i=0;i<ballenEind.length;i++){
        lengte=(ballenEind[i]-windowWidth/2)/afwijking;
        afwijkingSTDEV=Math.pow(lengte-average,2)
        sum+=afwijkingSTDEV;
    }

    stdev=Math.round(Math.pow(sum/ballenEind.length,0.5)*100)/100;

    tekstAfw="Standaarddeviatie is "+stdev;
    tekstGem="Gemiddelde is " +average;
  


  }





  // Wanneer het venster van grootte verandert...
  function windowResized() {
    // ...verander dan ons canvas mee!
    resizeCanvas(windowWidth, windowHeight)
  
  } // einde van windowResized()
  
  // ---------------------------
  function tekenGrid() {
  
    midden=windowWidth/2;
    deel=xAfstand/2;
    

    //De middelste rij
    for(i=0;i<maxRijen;i++){
        tekenPunt(midden, start+i*xAfstand)
        // Hoofd
    }

    for (j=0;j<maxRijen;j++){
        for(i=0;i<maxRijen-j;i++){
            tekenPunt(midden-(1+2*j)*afwijking, (1+2*j)*deel+start+i*xAfstand)
            tekenPunt(midden+(1+2*j)*afwijking, (1+2*j)*deel+start+i*xAfstand)
            if (i!=maxRijen-1-j){
                tekenPunt(midden-(2+2*j)*afwijking, (2+2*j)*deel+start+i*xAfstand)
                tekenPunt(midden+(2+2*j)*afwijking, (2+2*j)*deel+start+i*xAfstand)
            }
        }
    }
    //De rij links en de rij rechts
    


  
  } // einde van tekenSmiley()
  function tekenPunt(x,y){
    stroke('black')
    strokeWeight(1)
    fill('black')
    circle(x, y, 5)

  }

  

  function tekenBal(x, y) {
  
    // Hoofd
    stroke('black')
    strokeWeight(1)
    fill('yellow')
    circle(x, y, grootteBal)
  
  } // einde van tekenSmiley()
  
  // ---------------------------

  function verplaatsBal(ball){

    ball.y=ball.y+snelheid;
    rest=2*(ball.y-start);
    
    check=rest- ball.nummer*xAfstand;

    if (rest>=0 && check>=0 && ball.y<=(2*maxRijen-1)*(xAfstand/2)+start ){
        ball.nummer++;
        if(Math.random()<grens){
            ball.x=ball.x+afwijking;
        }
        else{
            ball.x=ball.x-afwijking;
        }

    }

}

function checkEind(ball){

    if(ball.y > windowHeight-ondergrens){
        return false
    }

    if (ballenEind.length==0){
        return true
    }

    let filteredNumbers = ballenEind.filter(function (currentElement) {
        return currentElement ==ball.x;
    });

    var hoogteX=(filteredNumbers.length)*grootteBal;
     
    if(ball.y >= windowHeight-ondergrens-hoogteX){
        return false
    }

    return true;

}
class ballDrop {
    constructor(nummer, y, x) {
        this.nummer=nummer;
        this.x = x;
        this.y = y;
        this.eind=0;
    }
}