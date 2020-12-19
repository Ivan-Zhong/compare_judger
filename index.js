axios.defaults.baseURL = 'https://www.truemogician.com:1992';

var problem_lists = [
{
    id: 1,
    title: '最小生成树',
    tags: '图',
    creatorId: 0001,
    vote: 3
},
{
    id: 2,
    title: '最短路径',
    tags: '图',
    creatorId: 0001,
    vote: 5
},
{
    id: 3,
    title: '关键路径',
    tags: '图',
    creatorId: 0001,
    vote: 1
}];

$("#problem_list tbody").html(printProblemList());

function printProblemList(){
    let tbodyContent = '';
    problem_lists.forEach((item, index) => {
        tbodyContent += `
        <tr>
        <td id="table_item_id_${index}">${item.id}</td>
        <td><a class="table_item" href="#judgement_area" onclick="transitToJudgement(${item.id})" >${item.title}</a></td>
        <td>${item.tags}</td>
        <td>${item.creatorId}</td>
        <td>${item.vote}</td>
    </tr>
        `; 
    //     tbodyContent += `
    //     <tr>
    //     <td id="table_item_id_${index}">${item.id}</td>
    //     <td><a class="table_item" href="#judgement_area" onclick="transitToJudgement($('#table_item_id_${index}').text())" >${item.title}</a></td>
    //     <td>${item.tags}</td>
    //     <td>${item.creatorId}</td>
    //     <td>${item.vote}</td>
    // </tr>
    //     `;  //这里需要修改，里面的参数传递要重新写，因为到下一个界面获得题目名称是从服务器获得的。
    })
    return tbodyContent;
}

$("#judgement_area").hide();
$("#result_area").hide();

function transitToJudgement(problemId){
    // $("#breadcrumb_pos").text("some problem");
    $("#problem_list").hide();
    $("#judgement_area").show();
    getProblemDetail(problemId);
}

async function getProblemDetail(id)
{
    let response = await axios.get('/api/problem/getDetail', {
        params:{
            id:id
        }
    });
    upDateJudgementArea(response.data);
}

const myData = {
    id: 3,
    title: "最小生成树",
    description: "#Hello world!",
    //tags: null
    tags: ['Prim', "Kruskal", "图", "树", "dp"]
}

upDateJudgementArea(myData);

function upDateJudgementArea(problemData)
{   // id
    $("#judgeProblemId").text(problemData.id);
    // title
    $("#judgeProblemTitle").text(problemData.title);
    // description
    mdConverter(problemData.description);
    // tags
    let tagArea = document.getElementById("judgeProblemTags");
    tagArea.innerHTML = "";
    if(!problemData.tags)
    {
        tagArea.innerHTML = '<span class="text-secondary">暂无</span>'
    }
    else{
        let h = document.createElement('h5');
        for(let i = 0; i < problemData.tags.length; ++i)
        {
            if(i != 0)
            {
                let space = document.createTextNode(' ');
                let spaceElem = document.createElement('span');
                spaceElem.appendChild(space);
                h.appendChild(spaceElem);
            }
            let tagName = document.createTextNode(problemData.tags[i]);
            let newTag = document.createElement('span');
            newTag.classList.add("badge");
            newTag.classList.add("badge-info");
            newTag.appendChild(tagName);
            h.appendChild(newTag);
        // }
        tagArea.appendChild(h);
        }
    }
    // authorId //没看到通过用户id获得用户头像的接口

    //contributorsId

    //voteCount
    $("#judgeProblemVotes").text(problemData.voteCount);
    //datamakersId
    document.getElementById('genSelect').innerHTML = '';
    if(problemData.datamakersId)
    {
        updateSelect(document.getElementById('genSelect'), problemData.datamakersId);   //这里的接口还没搞明白
    }
    //standardProgramsId
    document.getElementById('standardSelect').innerHTML = '';
    if(problemData.standardProgramsId)
    {
        updateSelect(document.getElementById('standardSelect'), problemData.standardProgramsId);
    }
    //specialJudgersId?
}

//说是哪里要加tooltip来着？

function judgementToProblems(){
    $('#problem_list').show();
    $("#judgement_area").hide();
$("#result_area").hide();
}

async function searchProblem(value, cls){
    // 应该先判断输入是否符合要求，需要添加
    let response;
    if(cls === 'title'){
        response = await axios.get("/api/problem/search",{
            params:{
                title: value
            }
        });
    }
    else if(cls === 'id'){
        response = await axios.get("/api/problem/search",{
            params:{
                id: parseInt(value)
            }
        })
    }
    else if(cls === 'tag'){
        response = await axios.get('/api/problem/search', {
            params:{
                tags:parseInt(value)
            }
        })
    }
    problem_lists = response.data;
    $("#problem_list tbody").html(printProblemList());
}

const md_test = `
#hello world!
## interesting
`

var problem_data;

mdConverter(md_test);

$("#view-area").on("change", () => {
    mdConverter($("#view-area").text());
})

function mdConverter(md) {
    var converter = new showdown.Converter();  //增加拓展table
    converter.setOption('tables', true);  //启用表格选项。从showdown 1.2.0版开始，表支持已作为可选功能移入核心拓展，showdown.table.min.js扩展已被弃用
    var view = converter.makeHtml(md);
    document.getElementById("view-area").innerHTML = view;
}

$("#upload_own_datagen").hide();
$("#upload_others_datagen").hide();

$('#datagen_own').on('click', ()=>{
    $("#upload_own_datagen").show();
    $("#upload_others_datagen").hide();
})

$('#datagen_others').on('click', ()=>{
    $("#upload_own_datagen").hide();
    $("#upload_others_datagen").show();
})

$("#ownDatagenName").hide();

let datagenFile = document.getElementById('ownDatagen');
let standardFile = document.getElementById('ownStandardProgram');
let targetFile = document.getElementById('targetProgram');
datagenFile.addEventListener('change', () => {
    showFileName(datagenFile, "#ownDatagenName");
});
standardFile.addEventListener('change', () => {
    showFileName(standardFile, "#ownStandardProgramName");
})
targetFile.addEventListener('change', () => {
    showFileName(targetFile, "#targetProgramName");
    setLanguage(targetFile);
})



const showFileName = (file, filenameArea) => {
    $(filenameArea).text(file.value.split(/[\\\/]/).pop());
    $(filenameArea).show();
}


//在按拍之后应该有函数来获得所有datagen信息、standardProgram信息
//

const setLanguage = (file) => {
    console.log(file.value.split(/[\\\/]/).pop().split('.').pop().toUpperCase())
    if(file.value.split(/[\\\/]/).pop().split('.').pop().toUpperCase() === 'C')
    {
        $("#language").val('C');
    }
    else
    {
        $("#language").val('C++');
    }
    $("#language").trigger('change');
}

$('#language').on("change", () => {
    setStandard($('#language').val());
})


let cppStandard = ["C++89", "C++03", "C++11", "C++14", "C++17"];
let cStandard = ["C89", "C99", "C11"];

const initStandard = () => {
    let selectStandard = document.getElementById("standard");
    for(let i = 0; i < 5; ++i)
    {
        let opt = document.createElement("option");
        let text = document.createTextNode(cppStandard[i]);
        opt.appendChild(text);
        selectStandard.appendChild(opt);
    }
}

initStandard();

const setStandard = (lang) => {
    let selectStandard = document.getElementById("standard");
    selectStandard.innerHTML = "";
    if(lang === 'C')
    {
        for(let i = 0; i < 3; ++i)
        {
            let opt = document.createElement("option");
            let text = document.createTextNode(cStandard[i]);
            opt.appendChild(text);
            selectStandard.appendChild(opt);
        }
        $("#standard").val('C11');
    }
    else if(lang === 'C++')
    {
        for(let i = 0; i < 5; ++i)
        {
            let opt = document.createElement("option");
            let text = document.createTextNode(cppStandard[i]);
            opt.appendChild(text);
            selectStandard.appendChild(opt);
        }
        $("#standard").val('C++11');
    }
}

// $("#startBAT").on("click", () => {
//     let formData = new FormData(document.getElementById("judgeForm"));
//     console.log(formData);
// })

let form = document.getElementById("judgeForm");
form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    new FormData(form);
});

form.addEventListener('formdata', (ev) => {
    let data = ev.formData;
    var dataobj = {};
    data.forEach((value, key) => dataobj[key] = value);
    var datajson = JSON.stringify(dataobj);
    console.log(datajson);
    // data.append('hello', 'world');
    // console.log("keys");
    // for(var key of data.keys())
    // {
    //     console.log(key);
    // }
    // console.log("values");
    // for(var value of data.values())
    // {
    //     console.log(value);
    // }
    // console.log(data);
    
})

function vote(up){
    axios({
        method: "put",
        url: "/api/problem/vote",
        params:{
            id: personID
        },
        data:{
            voteup: up
        }
    }).then(response => {
        if(response.status === 409){
            // 显示提示消息？
        }
        else{
            // 直接增加票数？
        }
    }).catch(err => {
        console.log(err);
    })
}

$("#voteUp").on("click", () => {
    vote(true);
});
$("#voteDown").on("click", () => {
    vote(false);
});