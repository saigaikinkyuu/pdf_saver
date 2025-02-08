function pdfShow(url){
  pdfjsLib.getDocument(url).promise.then(pdf => {
    document.body.innerHTML = "<div id='pdfContainer'></div>"
    const container = document.getElementById('pdfContainer');
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      pdf.getPage(pageNum).then(page => {
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.className = 'pdfPage';
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        container.appendChild(canvas);
        page.render(renderContext).promise.then(() => {
          console.log(`Page ${pageNum} rendered`);
        });
      });
    }
  }).catch(reason => {
    console.error(reason);
  });
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// クエリパラメータ "name" を取得する
const id = urlParams.get('id');
const name = urlParams.get('name');
let flag = false

fetch("../files.json")
  .then(response => response.json())
  .then(data => {
    let datas = data.active
    fetch("./data.json")
      .then(response => response.json())
      .then(items => {
        let item = items.files
        for(let i = 0;i<item.length;i++){
          if(item[i].key === id && item[i].url === name){
            for(let s = 0;s<datas.length;s++){
              if(datas[s].url === name){
                if(datas[s].sta === "available"){
                  s += datas.length
                  pdfShow("../files/ac/" + item[i].hrf)
                  document.title = "Contents"
                  flag = true
                  // a要素を作成してダウンロードを実行
                  const url = "../files/ac/" + item[i].hrf"
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  // ダウンロード後に不要なa要素を削除
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              }
            }
            i += item.length
          }
        }
        if(flag === false){
          window.location.href = "../error/?code=10001&num=null"
        }else{
          const url = new URL(window.location);
          // URLのクエリパラメータを削除
          url.search = '';
          // 新しいURLをヒストリーに追加し、ページをリロードせずにURLを変更
          window.history.pushState({}, document.title, url);
        }
      })
  })
