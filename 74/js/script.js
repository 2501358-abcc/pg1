// index.html
function getData(){
    let dayResult = document.getElementsByName("cheack");
    let checkValue = false; //　チェックが一つでもついていたらtrueになる変数
    let getValue = {}

    // チェックがついた項目のvalueをkey,input type=textのvalueをvalueをして配列にいれる
    for(let i = 0; i < dayResult.length; i++){
        if(dayResult[i].checked){
            let key = dayResult[i].value;
            let inputText = document.getElementById(key).value;
            getValue[key] = inputText;

            // 初期化
            document.getElementById(key).value = "";
            dayResult[i].checked = false;

            checkValue = true;
        }
    }



    // 全ての項目でチェックなし
    if(checkValue == false){
        getValue["nulldata"] = false;
    }

    // 日付の取得
    var date = new Date();
    let today = String(date.getFullYear()) + String(date.getMonth()+1).padStart(2, "0") + String(date.getDate())

    let dateAry = {};
    let displayDay =
        (date.getFullYear()) + "年" + (date.getMonth()+1)+ "月" + (date.getDate()) + "日";
    dateAry["表示用年月日"] = displayDay;
    let year = date.getFullYear();
    dateAry["年"] = year;
    let month = date.getMonth()+1;
    dateAry["月"] = month;
    let day = date.getDate();
    dateAry["日"] = day;

    getValue["日付関連"] = dateAry;

    // 日付をkey,入力した項目をvalueとして配列に保存(ローカルストレージ内にない場合は作成)
    let history = JSON.parse(localStorage.getItem("inputdata"));
    if(history == null){
        history = {};
    }
    history[today] = getValue;

    localStorage.setItem("inputdata",JSON.stringify(history));

    alert("今日も一日よく頑張りました！");
}


// resultLog.html
function outputData(x){
    logDeleat(); // 初期化
    let history = JSON.parse(localStorage.getItem("inputdata"));
    let logDiv = document.getElementById("logdiv");

    if(history == null){
        // まだ何も記録がありませんと表示
        let falseDiv = createTagClass("div","falseDiv");
        let falseP = createTagClass("p","falseP");
        falseP.textContent = "まだ記録がありません"
        falseDiv.appendChild(falseP);
        logDiv.appendChild(falseDiv);
        return;
    }

    // ソートするために配列のkey
    let keys;
    if(x == "up"){
        keys = Object.keys(history).sort();
    }else if(x == "down"){
        keys = Object.keys(history).sort(desc)
    }

    len(history);

    for(let i of keys){
        let newDiv = document.createElement("div");
        newDiv.setAttribute("class","logElement"); // 下記のタグを入れる
        
        let dayh3 = document.createElement("h3");
        dayh3.setAttribute("class","dayh3");
        dayh3.textContent = history[i]["日付関連"]["表示用年月日"];
        newDiv.appendChild(dayh3);

        if(history[i].nulldata == false){
            //　全ての項目にチェックがついていない場合の処理
            let newh3 = document.createElement("h3");
            newh3.textContent = "お休みday";

            newDiv.appendChild(newh3);
            logDiv.appendChild(newDiv);
        }else{

            // テーブルを作成しそれに入れていく
            let newTb = document.createElement("table");
            newTb.setAttribute("class","logTable");
            //let newUl = document.createElement("ul");

            // チェックがついいた項目の名前と一言をtdに記入、trに子要素として追加
            for(let koumoku in history[i]){
                if(koumoku == "日付関連"){
                    //日付の場合は何もしない
                }else{
                    let koumokuName = textChange(koumoku);
                    
                    let newTr = createTagClass("tr","logTr");

                    // 項目名のtdを作成
                    let newTd = createTagClass("td","koumokuTd");
                    newTd.textContent = koumokuName;
                    newTr.appendChild(newTd);

                    // 一言コメントのtdを作成
                    if(history[i][koumoku] != ""){
                        newTd = createTagClass("td","textTd");
                        newTd.textContent = history[i][koumoku];
                        newTr.appendChild(newTd);
                    }else{
                        newTd = createTagClass("td","textTd");
                        newTd.textContent = "頑張りました！";
                        newTr.appendChild(newTd);
                    }
                    
                    newTb.appendChild(newTr);
                }
            }
            newDiv.appendChild(newTb); //すべての値を追加し終えたらulをdivに子要素として追加
            logDiv.appendChild(newDiv)
        }
        
    }
}

// ログの表示件数を表示する関数
function len(array){
    let arrayLen = Object.keys(array).length; //連想配列はlengthで要素数を受け取れないので Object.keysでキーの数として取得する

    let NewLenDiv = createTagClass("div","lenDiv");
    let lenNewP = createTagClass("p","lenP") ;
    lenNewP.textContent = "全" + arrayLen + "件を表示"; // テキスト表示

    //htmlに追加
    NewLenDiv.appendChild(lenNewP);
    let parentDiv = document.getElementById("logdiv");
    parentDiv.appendChild(NewLenDiv);
}

// localstrageから受け取った値を変換する関数
function textChange(text){
    let changedText;
    switch(text){
        case "paiza":
            changedText = "paiza";
            break;
        case "shiken":
            changedText = "資格試験対策";
            break;
        case "syotest":
            changedText = "小テスト対策";
            break;
        case "work":
            changedText = "課題";
            break;
        case "other":
            changedText = "その他";
            break;
    }
    console.log(changedText);
    return changedText;
}


// ソート用
function desc(a,b){
    return b-a;
}

function logDeleat(){
    let parent = document.getElementById("logdiv");

    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}


// タグ生成
function createTagClass(tag,className){
    let newTag = document.createElement(tag);
    newTag.setAttribute("class",className);
    return newTag;
}


// 共通

// 一言コメント表示
let fightArray = [
    "今日もよくやったね",
    "今日も一日お疲れさまでした",
    "一日の成果見せてもらいましょうか",
    "記録しに来て偉いぞ",
    "明日もがんばれ！がんばれ！",
    "努力は必ず報われるよ",
    "明日も頑張るぞ！",
    "日々の積み重ね。今日もよくやりました",
    "お疲れさま！ゆっくり休んでね",
    "睡眠はしっかりとれているかな？体調を崩さないようにね",
    "頑張りすぎていないかな。少し心配",
    "頑張らない日もある。あってもいいじゃない"
]

let resultArray = [
    "頑張った記録。たまには振り返ってモチベをあげよう",
    "サボってる記録あるかな～？",
    "頑張っているね。えらい！",
    "不具合とかあったらおしえてね",
    "表示バグはおきていないかな………？",
    "たまには自分をほめてあげて",
    "大丈夫。あなたは頑張っているよ",
    "もっと頑張って",
    "これからも応援してるよ",
    "その日のうちに報告しないと、バグが起きるよ",
    "初心者なりにがんばっているんだ",
    "継続は力なりだよ"
]

function displayComent(x){
    let comentP = document.getElementById("coment");
    if(x == "index"){
        let randomNum = Math.floor(Math.random()*11);
        comentP.textContent = fightArray[randomNum];
    }else if(x == "result"){
        let randomNum = Math.floor(Math.random()*11);
        comentP.textContent = resultArray[randomNum];
    }
}

// 別ページへのリンク
function changeComand(link){
    window.location.href = link;
}

// 説明書表示（他の要素にかぶせる形で表示する）
function displayInstructions(tagId){
    let tag = document.getElementById(tagId); // 説明書divをこのtagの後に追加する
    let insDiv = createTagClass("div","insDiv");  // 全体のdiv
    insDiv.setAttribute("id","insDiv");

    let buttonDiv = createTagClass("div","insButtonDiv"); // 表示をやめるためのbutton
    let insButton = createTagClass("button","insButton");
    insButton.textContent = "✕";
    insButton.setAttribute("onclick","deleteInstructions()")
    buttonDiv.appendChild(insButton);
    insDiv.appendChild(buttonDiv);

    let insTitle = createTagClass("h3","insTitle"); 
    insTitle.textContent = "説明書";
    insDiv.appendChild(insTitle);

    let insP = createTagClass("p","insp");
    insP.innerHTML = "今日行ったことにチェックを入れましょう！|<br>勉強した範囲を一言メモしておくと後で見返したときにわかりやすいかも<br>記入が終わったら完了ボタンで記録！<br>何もしてない日でも記録するのをお勧めするよ！<br>今までの記録はタイトル横の「過去」ボタンから確認できるよ！";
    insDiv.appendChild(insP);

    let insattension = createTagClass("p","insAttension");
    insattension.innerHTML = "注意！記録は当日に行ってね！<br>（前日の分を次の日に行うと、次の日の記録で上書きされてしまいます）"
    insDiv.appendChild(insattension);

    tag.before(insDiv); // 一言コメントの後に追加
}

function deleteInstructions(){
    let deleteTag = document.getElementById("insDiv");
    console.log(deleteTag);
    deleteTag.remove();
}