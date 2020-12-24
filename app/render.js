const parser = new DOMParser();//解析器解析可响应文本
const linksSection = document.querySelector('.links');
const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkUr1 = document.querySelector('.new-link-url');
const newLinkSubmit = document.querySelector('.new-link-submit');
const clearStorageButton = document.querySelector('.clear-storage');
const {shell} = require('electron');

const clearform = () => {
    newLinkForm.value = null;
}

const parseresponse = (text) => {
    return parser.parseFromString(text, 'text/html');
}

const findtitle = (nodes) => {
    return nodes.querySelector('title').innerHTML;
}

const storetitle = (title, url) => {
    localStorage.setItem(url, JSON.stringify({ title: title, url: url }));
}

const getlinks = () => {
    return Object.keys(localStorage)
        .map(key => JSON.parse(localStorage.getItem(key)));
}

const convertToElement = (link) => {
    return `
    <div class="link">
    <h3>${link.title}</h3>
    <p><a href="${link.title}">${link.url}</a></p>
    </div>
    `
}

const renderlinks = () => {
    const linkitems = getlinks().map(convertToElement).join('');
    linksSection.innerHTML = linkitems;
}

const rendererrmsg = (error,url)=>{
    errorMessage.innerHTML=`Error when adding${url}:${error}`.trim();
    setTimeout(()=>{errorMessage.innerHTML=''},3000);
}

const validateresponse = (Response)=>{
    if(Response.ok){return Response;}
    throw new Error(`Status code of ${Response.status}${Response.statusText}`
    );
}

newLinkUr1.addEventListener('keyup', () => {
    newLinkSubmit.disabled = !newLinkUr1.validity.valid;
})

newLinkForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = newLinkUr1.value;
    fetch(url)
        .then(validateresponse)//防止400错误
        .then(Response => Response.text())
        .then(parseresponse)
        .then(findtitle)
        .then(title => storetitle(title, url))//把标题和url保存在本地储存库中
        .then(clearform)
        .then(renderlinks)
        .catch(error=>rendererrmsg(error.url));//其他错误
    linksSection.innerHTML='';
})

clearStorageButton.addEventListener('click',()=>{
    localStorage.clear();
    linksSection.innerHTML='';
})

linksSection.addEventListener('click',(event)=>{
    if(event.target.href){
        event.preventDefault();
        shell.openExternal(event.target.innerHTML);//使用shell来从默认浏览器内打开链接
    }
})

renderlinks();
console.log('123')
