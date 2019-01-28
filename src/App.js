import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css'
import './App.css';
import {Bar} from 'react-chartjs-2';
import {Line} from 'react-chartjs-2';

/**
 * Apufunktio, jolla muotoillaan päivämäärä muodosta VVVV-KK-PP
 * muotoon PP.KK.VVVV.
 * @param {Sting} paiva - paiva muodossa VVVV-KK-PP. 
 */

function muotoilePaivamaara(paiva){
  let pvm;
  if(paiva===undefined)
  {
    pvm = new Date();
  } else {
    pvm = new Date(paiva);
  }
  let tulos = pvm.getDate()  + "." + (pvm.getMonth() + 1) + "." + pvm.getFullYear();
  return tulos;
}

/**
 * Apufunktio, jolla syöyetystä ajasta muotoillaan tunnit desimaalimuodossa.
 * jolla voidaan laskea lenkin nopeus.
 * @param {String} hhmmss - merkkijono, aika muodossa "hh:mm:ss". 
 */

function muotoileTunnit(hhmmss){
let hh = Number(hhmmss.substring(0,2))
let mm = Number(hhmmss.substring(3,5));
let ss = Number(hhmmss.substring(6,8));

let tunnit = hh + mm/60 + ss/3600;

return tunnit;
}

/**
 * Yksittäinen merkintä-komponentti.
 */

class Merkinta extends Component {
  /**
   * Merkintä komponentin konstruktori.
   * @param {Object} props - Komponentin kutsussa annetut ominaisuudet.
   */
  constructor(props){
    super(props);
    this.poistaMerkinta=this.poistaMerkinta.bind(this);
    this.muokkaaMerkintaa=this.muokkaaMerkintaa.bind(this);

  }
  /**
   * Kutsuu ylemmän komponentin poistaMerkintä-funtkiota, joka poistaa tämän merkintä-komponentin.
   */
  poistaMerkinta(){
    console.log("(Merkinta) Poistetaan merkinta.");
    this.props.poistaMerkinta(this.props.index);
  }

  /**
   * Kutsuu ylemmän komponentin muokkaaMerkintä-funtkiota, joka muokkaa tätä merkintä-komponentin.
   */

  muokkaaMerkintaa(){
    console.log("(Merkinta) Muokataan merkintaa.");
    this.props.muokkaaMerkintaa(this.props.index);
  }

  /**
   * Piirtää yksittäisen merkinnän. Laittaa ennätys merkinnän, jos matka tai vauhti on ennätyksellinen.
   */

  render() {
    
      let ennatysmatkamerkinta=""
      let ennatysvauhtimerkinta=""

      if(this.props.merkinta.ennatysmatka)
      {
        ennatysmatkamerkinta = <div className="merkinta-ennatys"> (<i className = "fa fa-trophy" aria-hidden="true"></i> Ennätys!)</div>;
      }

      if(this.props.merkinta.ennatysvauhti)
      {
        ennatysvauhtimerkinta = <div className="merkinta-ennatys"> (<i className = "fa fa-trophy" aria-hidden="true"></i> Ennätys!)</div>;
      }

    return (
      <div className="merkinta">
        <div className="merkinta-kokonaismatka">{this.props.merkinta.kokonaismatka} km</div>
        <div className="merkinta-paiva"><i className="fa fa-calendar" aria-hidden="true"></i> {muotoilePaivamaara(this.props.merkinta.paivays)}</div>
        <div className="merkinta-tyyppi">{this.props.merkinta.tyyppi}</div>
        <div className="merkinta-lenkki-info">
          <div className="merkinta-lenkki-info-matka">
            <div><i className="fa fa-road" aria-hidden="true"></i> {this.props.merkinta.matka} km</div>
            {ennatysmatkamerkinta}
          </div>
          <div className="merkinta-lenkki-info-kesto">
            <div><i className="fa fa-clock-o" aria-hidden="true"></i> {this.props.merkinta.kesto}</div>
          </div>
          <div className="merkinta-lenkki-info-vauhti">
            <div><i className="fa fa-tachometer" aria-hidden="true"></i> {this.props.merkinta.vauhti} km/h</div>
            {ennatysvauhtimerkinta}
          </div>
          <div className="merkinta-nappi"><button onClick={this.poistaMerkinta} ><i className="fa fa-trash" aria-hidden="true"></i> poista</button></div>
          <div className="merkinta-nappi"><button onClick={this.muokkaaMerkintaa}><i className="fa fa-pencil-square-o" aria-hidden="true"></i> muokkaa</button></div> 
        </div>
        <div className="merkinta-kalorikulutus"><i className="fa fa-fire" aria-hidden="true"></i>{this.props.merkinta.kalorikulutus} kcal</div>
        <div className="merkinta-clear"></div>
      </div>
    );
  }
}

/**
 * Lenkkipankin merkinnät- komponentti. näyttää tallennetut merkinnät tai lomakkeen.
 */

class Merkinnat extends Component {

  /**
   * Merkinnät-komponentin kontruktori. Luo mahdolliset tilat ja asettaa oletusttilaksi tallennetut merkinnät.
   * @param {Object} props - Komponentin kutsussa annetut ominaisuudet.  
   */
  constructor(props){
    super(props);
    this.TILA={
      MERKINNAT: "merkinnat",
      LOMAKE: "lomake"
    };
    this.state = {
      tila: this.TILA.MERKINNAT,
      muokattava: null};

    this.poistaMerkinta=this.poistaMerkinta.bind(this);
    this.muokkaaMerkintaa=this.muokkaaMerkintaa.bind(this);
    this.peruutaMuokkaus=this.peruutaMuokkaus.bind(this);
    this.tallennaMerkinta=this.tallennaMerkinta.bind(this);
    this.uusiMerkinta=this.uusiMerkinta.bind(this);
  }

  /**
   * Kutsuu ylemmän komponentin poistamerkinnät- funktiota parametrinään poistettavan merkinnän
   * indeksi numero.
   * @param {number} index - Poistettavan merkinnän indeksi- numero. 
   */

  poistaMerkinta(index){
    console.log("(Merkinnat) Poistetaan merkinta " + index);
    this.props.poistaMerkinta(index);
  }

  /**
   * funktio, joka peruuttaa muokkauksen. Palauttaa näkymäksi merkinnät ja 
   * laittaa muokattavan arvoksi null.
   */

  peruutaMuokkaus(){
    console.log("(Merkinnat) peruutetaan merkinnän muokkaus.");
    this.setState({
      tila:       this.TILA.MERKINNAT,
      muokattava: null});
  }

  /**
   * Avaa lomakkeen parametrinaan muokattavan merkinnän indeksinumero.
   * @param {number} index - Muokattavan merkinnän indeksi- numero. 
   */

  muokkaaMerkintaa(index){
    console.log("(Merkinnat) Avataan merkinnan " + index + " muokkauslomake");
    this.setState({
      tila:       this.TILA.LOMAKE,
      muokattava: index});
  }

  /**
   * kutsuu ylemmän komponentin tallennamerkintä- funktiota parametrinaan merkinnän data, joka toimitetaan täten
   * ylemmälle komponentille. Jos komponentin muokattava-state muutujan arvo on null tulee uusi merkintä, muuten
   * tallennataan uusi data vanhaan merkintään.
   * @param {Object} data - tallennettavan merkinnän data. 
   */

  tallennaMerkinta(data){
    console.log("(Merkinnät) tallennetaan merkinnan tiedot." );
    this.props.tallennaMerkinta(this.state.muokattava, data);
    this.setState({
      tila:       this.TILA.MERKINNAT,
      muokattava: null});
  }

   /**
   * Avaa lomakkeen parametrinaan muokattavan arvolla null.
   * @param {number} index - Muokattavan merkinnän indeksi- numero. 
   */

  uusiMerkinta(data){
    console.log("(Merkinnät) Avataan merkinnän lisäys lomake.");
    this.setState({tila: this.TILA.LOMAKE});
  }

  /**
   * Funktio, joka piirtää merkkinnät komponentin. Joko tallennetut merkinnät(ja lisäysnapin) tai
   * lomakkeen, riippuen komponentin tila state-muuttujasta.
   */

  render(){

    let merkinnat = this.props.merkinnat.map((merkinta, index)=>
                    <Merkinta key={merkinta.kokonaismatka}
                              merkinta = {merkinta} 
                              index={index}
                              poistaMerkinta={this.poistaMerkinta}
                              muokkaaMerkintaa={this.muokkaaMerkintaa}/>
                );

    if(this.state.tila===this.TILA.LOMAKE){
      
      if(this.state.muokattava===null){
        return(
          <Lomake tallennaMerkinta={this.tallennaMerkinta}
                  peruutaMuokkaus={this.peruutaMuokkaus}/>
        );
      }else{

        let merkinta=this.props.merkinnat[this.state.muokattava];
        return(
          <Lomake tallennaMerkinta={this.tallennaMerkinta}
                  peruutaMuokkaus={this.peruutaMuokkaus}
                  merkinta={merkinta}/>
        );
      }

    } else {
      return(
        <div className="merkinnat">
          <Lisaysnappi uusiMerkinta={this.uusiMerkinta}/>
          { merkinnat }
        </div>
      );
    }
  }
}

/**
 * Komponentti, jolla luodaan uusi merkintä Lenkkipankki sovellukseen.
 */

class Lisaysnappi extends Component{

  /**
   * Lisäysnapin kontruktori.
   * @param {Object} props - - Komponentin kutsussa annetut ominaisuudet.  
   */
  constructor(props){
    super(props);
    this.uusiMerkinta=this.uusiMerkinta.bind(this);
  }

  /**
   * funktio, jolla avataan lisäyslomake.
   */

  uusiMerkinta(){
    console.log("(lisäysnappi) Avataan lisäyslomake");
    this.props.uusiMerkinta();
  }

  /**
   * Piirtää lisäysnapin.
   */

  render(){
    return(
      <button className="lisaysnappi" onClick={this.uusiMerkinta}><i className="fa fa-plus" aria-hidden="true"></i></button>
    );
  }
}

/**
 * Komponenti, jolla luodaan tai muokataan merkintää Lenkkipankki sovellukseen.
 */

class Lomake extends Component{

  /**
   * Kompontentin konsruktori, luo joko uuden merkinnän, tai muokkaa jo olemassa olevaa,
   * riippuen merkintä-propsista.
   * @param {Object} props - Komponentin kutsussa annetut ominaisuudet. 
   */

  constructor(props){
    super(props);
    this.kasitteleSyote=this.kasitteleSyote.bind(this);
    this.peruutaMuokkaus=this.peruutaMuokkaus.bind(this);
    this.tallennaMerkinta=this.tallennaMerkinta.bind(this);

    if(this.props.merkinta===undefined){
      this.state={
        paivays: muotoilePaivamaara(),
        tyyppi: "Juoksu",
        matka: '',
        kesto: '',
        vauhti: '',
        kalorikulutus: ''
      }
    }else{
          this.state={
            paivays: muotoilePaivamaara(this.props.merkinta.paivays),
            tyyppi: this.props.merkinta.tyyppi,
            matka: this.props.merkinta.matka,
            kesto: this.props.merkinta.kesto,
            vauhti: this.props.merkinta.vauhti,
            kalorikulutus: this.props.merkinta.kalorikulutus
          }
          }
      }

  /**
   * funktio joka käsittelee syötettävän datan. Ja laskee syötetyistä arvoista automaattisesti jotkut
   * arvot mm. matkasta ja kestosta nopeuden.
   * @param {Object} event - Syötekentän tapahtuma 
   */      

  kasitteleSyote(event){
    const syotekentta = event.target;
    const arvo = syotekentta.value;
    const nimi = syotekentta.name;
    console.log("(Lomake) Syötekentan käsittely, kentän " + nimi + " uusi arvo on " + arvo);
    let newState={
      [nimi]: arvo
    }

    if(nimi==="matka") {
      let vauhti= (arvo/muotoileTunnit(this.state.kesto)).toFixed(2);
      Object.assign(newState, {vauhti: vauhti});
    }

    if(nimi==="kesto") {
      let vauhti= (this.state.matka/muotoileTunnit(arvo)).toFixed(2);
      Object.assign(newState, {vauhti: vauhti});
      if(this.state.tyyppi==="Juoksu") {
        let kalorikulutus = (727*muotoileTunnit(arvo)).toFixed(0);
        Object.assign(newState, {kalorikulutus: kalorikulutus});
      }else{
        let kalorikulutus = (393*muotoileTunnit(arvo)).toFixed(0);
        Object.assign(newState, {kalorikulutus: kalorikulutus});
      }
    }

    if(nimi==="tyyppi") {
      if(arvo==="Juoksu") {
        let kalorikulutus = (727*muotoileTunnit(this.state.kesto)).toFixed(0);
        Object.assign(newState, {kalorikulutus: kalorikulutus});
      }else{
        let kalorikulutus = (393*muotoileTunnit(this.state.kesto)).toFixed(0);
        Object.assign(newState, {kalorikulutus: kalorikulutus});
      }
    }

    this.setState(newState);
  }

  /**
   * funktio, joka peruuttaa muokkauksen. Estää oletus tapahtuman ja kutsuu propsien
   * peruutaMuokkaus funktiota.
   * @param {Object} event - tapahtuma 
   */

  peruutaMuokkaus(event){
    event.preventDefault();
    console.log("(Lomake) Muokkauksen peruutus.");
    this.props.peruutaMuokkaus();
  }

  /**
   * Merkinnän tallennus funktio. Luo merkinnän state-muuttujistaan.
   * Ja toimittaa sen ylemmälle komponentille talletettavaksi.
   * @param {Object} event 
   */

  tallennaMerkinta(event){
    event.preventDefault();

    console.log("(Lomake) Merkinnan tallennus.");
    
    let pilkottupaivays = this.state.paivays.split(".");
    pilkottupaivays.reverse();
    let paivays = pilkottupaivays.join("-");

    let merkinta={
      paivays: paivays,
      tyyppi: this.state.tyyppi,
      matka: this.state.matka,
      kesto: this.state.kesto,
      vauhti: this.state.vauhti,
      kalorikulutus: this.state.kalorikulutus,
      kokonaismatka: 0
    }

    this.props.tallennaMerkinta(merkinta);
  }

  /**
   * Pirtää lomakkeen ruudulle.
   */

  render(){
    return(
      <div className="lomake">
        <form onSubmit={this.tallennaMerkinta}>

          <div><label>Päivämäärä</label>
            <input type="text" name="paivays" placeholder="pp.kk.vvvv" pattern="\d{1,2}.\d{1,2}.\d{4}" required
            value={this.state.paivays} onChange={this.kasitteleSyote}/></div>

          <div><label>Tyyppi</label>
            <select name="tyyppi"
            value={this.state.tyyppi} 
            onChange={this.kasitteleSyote}>
              <option value="Juoksu">Juoksu</option>
              <option value="Kävely">Kävely</option>
            </select>
          </div>

          <div><label>Matka</label>
            <input type="number" name="matka" min="0" step="0.01" required
            value={this.state.matka} onChange={this.kasitteleSyote}/></div>

          <div><label>Kesto</label>
            <input type="text" name="kesto" placeholder="hh:mm:ss" pattern="\d{2}:\d{2}:\d{2}" required
            value={this.state.kesto} onChange={this.kasitteleSyote}/></div>

          <div><label>Vauhti</label>
            <input type="number" name="vauhti" min="0" step="0.01" required
            value={this.state.vauhti} onChange={this.kasitteleSyote}/></div>

          <div><label>kulutus kilokaloreissa</label>
            <input type="number" name="kalorikulutus" min="0" required
            value={this.state.kalorikulutus} onChange={this.kasitteleSyote}/></div>

            <div className="lomake-napit">
              <button onClick={this.peruutaMuokkaus}>Peruuta</button>
              <button>Tallenna</button>
            </div>

        </form>
      </div>
    );
  }
}

/**
 * Tilasto-näkymäkomponentti. Piirtää tilaston state-muuttujan perusteella, joka valitaan pudotusvalikosta.
 */

class Tilasto extends Component{

  /**
   * Tilasto- komponentin konstruktori, jossa asetetaan tilaston mahdolliset tilat,
   * joita ovat kilometrit, kalorit ja juoksuvauhti.Piirtää eri tilaston näistä riippuen.
   * @param {Object} props - -Komponentin kutsussa annetut ominaisuudet.   
   */

  constructor(props){
    super(props);
    this.TILA={
      KILOMETRIT: "Kilometrit",
      KALORIT: "Kalorit",
      JUOKSUVAUHTI: "Juoksuvauhti"
    };
    this.state={ tilasto: this.TILA.KILOMETRIT};
    this.VaihdaTilasto = this.VaihdaTilasto.bind(this);
  }

  /**
   * funktio, jolla vaihdetaan näytettävä tilasto.
   * @param {Object} event - syötekentän tapahtuma.
   */

  VaihdaTilasto(event){
    const syotekentta = event.target;
    const vaihdettavatilasto = syotekentta.value;
    this.setState({tilasto: vaihdettavatilasto});
  }

  /**
   * Piirtää Tilastot- komponentin, riippuen komponentin state-muuttujasta.
   */

  render(){
    let sisalto;

    if(this.state.tilasto===this.TILA.KILOMETRIT){
      sisalto=<TilastoKilometrit merkinnat={this.props.merkinnat}/> 
    }
    else if(this.state.tilasto===this.TILA.JUOKSUVAUHTI){
      sisalto=<TilastoJuoksuvauhti merkinnat={this.props.merkinnat}/> 
    }
    else{
      sisalto=<TilastoKalorit merkinnat={this.props.merkinnat}/> 
    }

    return(
      <div className="tilasto">
        <div className="tilasto-valikko"><label>Tyyppi</label>
            <select name="tyyppi"
            onChange={this.VaihdaTilasto}>
              <option value={this.TILA.KILOMETRIT}>Kilometrit(km)</option>
              <option value={this.TILA.KALORIT}>Kalorit(kcal)</option>
              <option value={this.TILA.JUOKSUVAUHTI}>Juoksuvauhti(km/h)</option>
            </select>
        </div>
        {sisalto}   
      </div>
    );
  }
}

/**
 * Piirtää Tilastot-näkymään kuukausittaiset lenkkikilometrit- kuvaajan.
 */

class TilastoKalorit extends Component{

  /**
   * Tekee kopion merkinnät- propsista ja laskee kuukasittain poltetut kalorit ja tekee niistä kuvaajan.
   */

  render(){
    let lenkit = this.props.merkinnat.slice();

    var lenkkikilometritperkk=[];
    var currentIndex=-1;
    var currentKK=0;
    var currentV=0;
    var KUUKAUDET=["tammikuu", "helmikuu","maaliskuu","huhtikuu","toukokuu","kesäkuu","heinäkuu","elokuu","syyskuu","lokakuu","marraskuu","joulukuu"];
    var TilastoKK=[];

      for(var i=lenkit.length-1;i >=0 ;i--){

          let lenkkip = new Date(lenkit[i].paivays);
          let lenkkikk = lenkkip.getMonth();
          let lenkkiv = lenkkip.getFullYear();
          if (lenkkikk===currentKK && lenkkiv === currentV  ){
            lenkkikilometritperkk[currentIndex] += Number(lenkit[i].kalorikulutus);
          }else{
            lenkkikilometritperkk.push(0);
            currentIndex++;
            lenkkikilometritperkk[currentIndex] += Number(lenkit[i].kalorikulutus);
            TilastoKK.push(KUUKAUDET[lenkkikk] + " "  + lenkkiv);
            currentKK=lenkkikk;
            currentV=lenkkiv;
          } 
      }
    
    let data={
      labels: TilastoKK,
      datasets: [
        { 
          data: lenkkikilometritperkk, 
          label: 'kuukausittaiset lenkkikalorit',
          backgroundColor: 'rgba(230,81,0,1)'
        }
      ]
    }

    let options={
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
      }
    }

    return(
      <Bar data={data} options={options}/>
    );
  }
}

/**
 * Piirtää Tilastot-näkymään kuukausittaiset lenkkikilometrit- kuvaajan.
 */

class TilastoKilometrit extends Component{

   /**
   * Tekee kopion merkinnät- propsista ja laskee kuukasittain lenkkikilometrit ja tekee niistä kuvaajan.
   */
  
    render(){
      let lenkit = this.props.merkinnat.slice();
  
      var lenkkikilometritperkk=[];
      var currentIndex=-1;
      var currentKK=0;
      var currentV=0;
      var KUUKAUDET=["tammikuu", "helmikuu","maaliskuu","huhtikuu","toukokuu","kesäkuu","heinäkuu","elokuu","syyskuu","lokakuu","marraskuu","joulukuu"];
      var TilastoKK=[];
  
        for(var i=lenkit.length-1;i >=0 ;i--){
  
            let lenkkip = new Date(lenkit[i].paivays);
            let lenkkikk = lenkkip.getMonth();
            let lenkkiv = lenkkip.getFullYear();

            if (lenkkikk===currentKK && lenkkiv===currentV){
              lenkkikilometritperkk[currentIndex] += Number(lenkit[i].matka);
            }else{
              lenkkikilometritperkk.push(0);
              currentIndex++;
              lenkkikilometritperkk[currentIndex] += Number(lenkit[i].matka);
              TilastoKK.push(KUUKAUDET[lenkkikk] + " "  + lenkkiv);
              currentKK=lenkkikk;
              currentV=lenkkiv;
            }
            
          }
      
      let data={
        labels: TilastoKK,
        datasets: [
          { 
            data: lenkkikilometritperkk, 
            label: 'kuukausittaiset lenkkikilometrit',
            backgroundColor: 'rgba(1, 87, 155 ,1)'
          }
        ]
      }
      let options={
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              }
          }]
        }
      }
  
      return(
        <Bar data={data} options={options}/>
      );
    }
  }
/**
 * Piirtää Tilastot-näkymään juoksuvauhti kuvaajan.
 */

class TilastoJuoksuvauhti extends Component{

  /**
   * Tekee kopion merkinnät-propsista ja luo juoksu-lenkeistä datan kuvaajalle piirrettäväksi.
   * Juoksunopeudet/aika kuuvaja.
   */
  render(){

    let lenkit = this.props.merkinnat.slice();
    let tilastodata=[];
    for(var i=lenkit.length-1;i >=0 ;i--){
      if(lenkit[i].tyyppi==="Juoksu"){
        tilastodata.push({x: lenkit[i].paivays , y: lenkit[i].vauhti});
      }
    }
      
    let data={
      datasets: [
        {
        label: "Keskim. vauhti",
        fill: false,
        backgroundColor: 'rgba(255,255,255,1)',
        borderColor: 'rgba(255,255,255,1)',
        data: tilastodata
        }
      ]
    }

    let options={
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              displayFormats: {
                day: 'D.M.Y',
                month: 'M.Y',
                year: 'Y'
              }
            }
          }
        ]
      }
    }

    return(
      <Line data={data} options={options}/>
    );
  }
}

/**Lenkkipankki sovelluksen näkymä-komponentti, joka on vastuussa siitä,
 * minkä näkymän Lenkkipankki sovellus näyttää. Näkymä valitaan välilehdet-komponentilla.
 * Eri Näykymiä ovat logi, tilastot ja credits.
 */
class Nakyma extends Component{

  /**
   * Alustaa Näkymä komponentin,mm. määrittelee välilehdet- muuttujat, ja
   * asettaa ensin näkyviin merkinnät-näkymän. 
   * @param {Object} props - Komponentin kutsussa annetut ominaisuudet.  
   */
  constructor(props){
    super(props);
    this.VALILEHDET={
      MERKINNAT: "LOGI",
      TILASTOT: "TILASTOT",
      CREDITS: "CREDITS"
    }
    this.state={ valilehti: this.VALILEHDET.MERKINNAT }
    this.poistaMerkinta=this.poistaMerkinta.bind(this);
    this.valitseValilehti=this.valitseValilehti.bind(this);
    this.tallennaMerkinta=this.tallennaMerkinta.bind(this);
  }

  /**
   * kutsuu ylemmän komponentin poistaMerkintä- funktiota parametrinaan 
   * merkinnät-taulukon indeksinumero.
   * @param {number} index -Poistettavan merkinnän indeksinumero. 
   */
  poistaMerkinta(index){
    console.log("(Nakyma) Poistetaan merkinta " + index);
    this.props.poistaMerkinta(index);
  }

  /**
   * Asettaa komponentin tilaksi välilehden, joka tulee välilehdet- komponentilta.
   * React renderöi valitun näkymän Lenkkipankki-sovellukseen.
   * @param {Object} avain - valittu välilehti.  
   */

  valitseValilehti(avain){
    console.log("(Nakyma) Valitaan välilehdeksi " + avain);
    this.setState({valilehti: avain});
  }

  /**
   * Kutsuu ylemmän komponentin tallennaMerkintä -funktiota parametrinaan
   * tallennettavan merkinnän data ja indeksinumero merkinnät-taulukossa.
   * @param {number} index -Tallennettavan merkinnän indeksinumero merkinnät-taulukossa.
   * @param {Object} data -Tallennettavan merkinnän tiedot.
   */

  tallennaMerkinta(index, data){
    console.log("(Nakyma) Tallennetaan merkinnan tiedot.");
    this.props.tallennaMerkinta(index, data);
  }

  /**
   * Muodostaa selaimelle tulostettavan sisällön. Tässä tapauksessa
   * tulostettava sisältö riippuu komponentin valilehti state-muuttujasta, joka
   * on valitun välilehden- arvo.
   */

  render(){
  
    let sisalto;

    switch(this.state.valilehti){
      case this.VALILEHDET.MERKINNAT:
        sisalto=<Merkinnat merkinnat={this.props.merkinnat}
                           tallennaMerkinta={this.tallennaMerkinta}
                           poistaMerkinta={this.poistaMerkinta}/>
        break;
      case this.VALILEHDET.TILASTOT:
        sisalto=<Tilasto merkinnat={this.props.merkinnat}/>
        break;
      default:
        sisalto=<div>Niko Suoniemi</div>
    }

    return(
    <div className="nakyma">
      <div className="nakyma-sisalto">
        {sisalto}
      </div>
      <Valilehdet valilehdet={this.VALILEHDET}
                  valilehti={this.state.valilehti}
                  valitseValilehti={this.valitseValilehti}/>
    </div>
  );
}
}

/**
 * Lenkkipankki sovelluksen välilehdet komponentti. Komponentilla valitaan,
 * mitä näkymä-komponentti renderöi.
 */

class Valilehdet extends Component{

  /**
   * Alustaa välilehdet-komponentin.
   * @param {Object} props -Komponentin kutsussa annetut ominaisuudet. 
   */
  constructor(props){
    super(props);
    this.valitseValilehti=this.valitseValilehti.bind(this);
  }
  /**
   * Valitsee välilehden avaimen perusteella. Ja toimittaa kutsun ylemmälle komponentille.
   * @param {Object} avain - valittu välilehti 
   */
  valitseValilehti(avain){
    console.log("(Välilehdet) Välilehden vaihto --->" + avain);
    this.props.valitseValilehti(avain);
  }

   /**
   * Muodostaa selaimelle tulostettavan sisällön. Tässä tapauksessa
   * propsien kautta tulevat välilehdet joista tehdään napit.
   */

  render(){

    let lehdet=Object.keys(this.props.valilehdet).map((avain,index)=>{
      let arvo = this.props.valilehdet[avain];
      let luokka = this.props.valilehti===arvo ? "valilehdet-valittu" : "";
      return(
        <div key={avain} className={luokka}><button onClick={()=>this.valitseValilehti(arvo)}>{arvo}</button></div>
      );
    }
  )
    return(
      <div className="valilehdet">
        {lehdet}
      </div>

    );
  }
}

/**
 * Lenkkipankki sovelluksen pääkomponentti, johon tallentuu 
 * sovelluksen data.
 * @author Niko Suoniemi <nsuoniemi@gmail.com>
 * @version 1.0.0
 */

class Lenkkipankki extends Component{

  /**
   * Lataa merkinnät localStorage-taltiosta statemuuttujaan.
   * @param {Object} props - Komponentin kutsussa annetut ominaisuudet. 
   */

  constructor(props){
    super(props);

    let merkinnat=localStorage.getItem("merkinnat");
    if(merkinnat === null){
      merkinnat=[];
    } else {
      merkinnat=JSON.parse(merkinnat);
    }

    this.state={ merkinnat: merkinnat };
    this.muodostaMerkinnat=this.muodostaMerkinnat.bind(this);
    this.poistaMerkinta=this.poistaMerkinta.bind(this);
    this.tallennaMerkinta=this.tallennaMerkinta.bind(this);
  }

  /**
   * Muodostaa tallennetuista merkinnöistä tulostamisessa 
   * käytettävät merkintätiedot ja asettaa tiedot aika järjestykseen.
   * Funktio laskee tarvittavat tiedot tallennetusta datasta, 
   * esimerkiksi vauhdin matkasta ja kestosta, funktio lisäksi
   * laittaa ennätysmerkinnän suurimmalla matkalle ja vauhdille. 
   */
  muodostaMerkinnat(){

    let merkinnat = (this.state.merkinnat).slice();
    
    let vertailu = function(eka,toka){
      if(eka.paivays===toka.paivays)
      {
        return 1;
      }
      return new Date(eka.paivays)-new Date(toka.paivays)
    }
    merkinnat.sort(vertailu);

    let tulos=[];
    let kokonaismatka = 0;

    for(var i = 0; i < merkinnat.length; i++){
      let merkinta={};
      merkinta.paivays = merkinnat[i].paivays;
      merkinta.tyyppi = merkinnat[i].tyyppi;
      merkinta.matka = merkinnat[i].matka;
      merkinta.kesto = merkinnat[i].kesto;
      kokonaismatka += Number(merkinta.matka);
      merkinta.kokonaismatka=kokonaismatka.toFixed(2);
      if(muotoileTunnit(merkinta.kesto)===0){
        merkinta.vauhti=0;
      }else{
      merkinta.vauhti=(merkinta.matka/muotoileTunnit(merkinta.kesto)).toFixed(2);
      }

      if(merkinta.tyyppi==="Juoksu"){
        merkinta.kalorikulutus=(727*muotoileTunnit(merkinta.kesto)).toFixed(0);
      }
      else{
        merkinta.kalorikulutus=(393*muotoileTunnit(merkinta.kesto)).toFixed(0);
      }

      merkinta.ennatysmatka = false;
      merkinta.ennatysvauhti = false;
      
      tulos.push(merkinta);
    }

    let ennatysmatka=0;
    let ennatysmatkaindex=0;
    let ennatysvauhti=0;
    let ennatysvauhtiindex=0;

    for(var i=0;i<merkinnat.length;i++)
    {
      if(Number(tulos[i].matka)>ennatysmatka)
      {
        ennatysmatka=Number(tulos[i].matka);
        ennatysmatkaindex=i;
      }
      if(Number(tulos[i].vauhti)>ennatysvauhti)
      {
        ennatysvauhti=Number(tulos[i].vauhti);
        ennatysvauhtiindex=i;
      }
    }
    if(tulos[ennatysmatkaindex]!==undefined)
    {
    tulos[ennatysmatkaindex].ennatysmatka=true;
    }
    if(tulos[ennatysvauhtiindex]!==undefined)
    {
    tulos[ennatysvauhtiindex].ennatysvauhti=true;
    }

    let vertailu2 = function(eka,toka){
      if(eka.paivays===toka.paivays)
      {
        return 1;
      }
      return new Date(toka.paivays)-new Date(eka.paivays)
    }

    return tulos.sort(vertailu2);
  }

  /**
   * Poistaa merkinnän merkinnät-taulukosta, sekä tallentaa muutetun taulukon
   * localStorage- taltioon.
   * @param {number} index -Poistettavan merkinnän indeksinumero merkinnät-taulukossa.
   */

  poistaMerkinta(index){
    console.log("(Lenkkipankki) Poistetaan merkinta " + index);
    let merkinnat = (this.state.merkinnat).slice();
    merkinnat.splice(index,1);
    this.setState({merkinnat: merkinnat});
    localStorage.setItem("merkinnat", JSON.stringify(merkinnat));
  }

  /**
   * Tallentaa merkinnän tiedot taulukkoon, sekä järjestää merkinnät aikajärjestykseen.
   * Lisäksi tallentaa muutetun taulukon localStorage- taltioon.
   * @param {number} index -Tallennettavan merkinnän indeksinumero merkinnät-taulukossa.
   * @param {Object} data -Tallennettavan merkinnän tiedot.
   */

  tallennaMerkinta(index, data){
    console.log("(Lenkkipankki) Tallennetaan merkinnän tiedot.")
    let merkinnat = (this.state.merkinnat).slice();

    if(index===null) {
      merkinnat.push(data);
    } else {
      merkinnat[index]=data;
    }

    var vertailu = function(eka,toka){
      if(eka.paivays===toka.paivays)
      {
        return 1;
      }
      return new Date(toka.paivays)-new Date(eka.paivays)
    }
    merkinnat.sort(vertailu);
    
    this.setState({merkinnat: merkinnat});
    localStorage.setItem("merkinnat", JSON.stringify(merkinnat));
  }

  /**
   * Muodostaa selaimelle tulostettavan sisällön.
   */

  render(){
    let merkinnat=this.muodostaMerkinnat();
    return(
      <div className="lenkkipankki">
        <h1 className="lenkkipankki-otsikko">Lenkkipankki</h1>
        <Nakyma merkinnat={merkinnat}
                poistaMerkinta={this.poistaMerkinta}
                tallennaMerkinta={this.tallennaMerkinta}/>
      </div>
    );
  }
}

/**
 * Koko sovelluksen käynnistävä komponentti.
 */

class App extends Component {
  render() {
    return (
      <Lenkkipankki />
    );
  }
}

export default App;
