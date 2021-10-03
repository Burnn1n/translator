import './App.scss';
import React, { useEffect, useState } from "react";
function App() {
  var url = "https://example.com";
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("Орчуулга");
  const [data, setData] = useState("");
  const [words, setWords] = useState([]);
  //0 bol mongol 1 bol angli
  const [from, setFrom] = useState(0);//orchuulah hel
  const [to, setTo] = useState(1);//orchuulganii hariu

  var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
  //no-cors policy set up hiih
  function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function() {
      printResult(
        options.method + ' ' + options.url + '\n' +
        x.status + ' ' + x.statusText + '\n\n' +
        (x.responseText || '')
      );
    };
    if (/^POST/i.test(options.method)) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
  }
  const take = (webUrl) => {
    (function() {
      doCORSRequest({
          method:'GET',
          url: webUrl,
        }, function setResult(result) {
          setData(result);
        });
    })();

  }
  const onSearch = () =>{
    if (text) {
      console.log(text);
      url = "http://www.bolor-toli.com/dictionary/word?search="+text.toLowerCase()+"&selected_lang=4-1&see_usages=true&see_variants=true";
      if(from === to)
        setAnswer(text);
      else{
        take(url);
        setAnswer("Түр хүлээнэ үү");
      }
    }
    else{
      console.log("empty");
      setAnswer("Орчуулга");
    }
  }
  
  useEffect(() => {
      console.log("data ",data);
      //heregtei ugugldluudiig salgaj awah
      //irj bui value ni `('айх')"` bolno
      if (data){
        var values = data.match(/(?<=searchThisWord\s*).*?(?=\s*class)/gs);
        // irsen ilertsuudiin zowhon ehnii 40-g awah
        if(values){
          values = values.slice(0, 40);
          //irsen value-g tsewerlen zowhon ugsiig awah
          values !== null && values.forEach(function(part, index) {
          this[index] = this[index].replaceAll("(","").replaceAll(")","").replaceAll("'","").replaceAll('"','');
          }, values);
        }
        setWords(values);
        console.log("values ",values);
        if(data.length < 200)
          setAnswer("Алдаа гарлаа");
      }
  },[data]);

  useEffect(() => {
    if (words === null){
      setAnswer("Илэрц олдсонгүй");
      if(data.length < 200)
        setAnswer("Алдаа гарлаа");
    }
    else{
      setAnswer(words.join(', '));
    }
  },[words]);

  const handleKeypress = e => {
    //13 = enter
  if (e.keyCode === 13) {
    onSearch();
  }
};
  return (
    <div className="App">
      <a href="https://cors-anywhere.herokuapp.com/corsdemo">Алдаа гарвал ийшээ орон хандалтийг нээнэ үү</a>
      <div className="first">
      <button id="submit" onClick={onSearch}onKeyPress={handleKeypress} >
          Орчуулах
        </button>
      </div>
        
      <div className="translator">
      <div className="field">
        <div className="fieldHeader">
          <button className={from===0?"language selected":"language"} onClick={() => setFrom(0)}>
          <span>
            Монгол
          </span>
          </button>
          <button className={from===1?"language selected":"language"} onClick={() => setFrom(1)}>
          <span>
            English
          </span>
          </button>
        </div>
        <div className="fieldInput">
          <textarea name="" id="" cols="30" rows="10" onChange={e => setText(e.target.value)}placeholder="Орчуулах үгээ"></textarea>
        </div>
      </div>
      <div className="field">
      <div className="fieldHeader">
          <button className={to===0?"language selected":"language"} onClick={() => setTo(0)} >
          <span>
            Монгол
          </span>
          </button>
          <button className={to===1?"language selected":"language"} onClick={() => setTo(1)}>
          <span>
            English
          </span>
          </button>
        </div>
        <div className={!text?'fieldInput':'fieldInput translation'}>
          <textarea cols="30" rows="10" className="translation" value={answer} disabled></textarea>
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
