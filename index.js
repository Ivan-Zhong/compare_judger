axios.defaults.baseURL = 'https://www.truemogician.com:1992';

///////////////////////////
/* MORRIS BAR CHART
            -----------------------------------------*/
var graph = Morris.Line({
    element: 'graph_points',
    data: [{ x: 0, y: 0, z: 0, w: 0 }],
    xkey: ['x'],
    ykeys: ['y', 'z', 'w'],
    labels: ['DataMaker Performance', 'Standard Program Performance', 'Judged Program Performance'],
    parseTime: false,
});
//var clipboard = new Clipboard('.copy-button', {
//    container: $('#pointErrorMessageModal') //html所在模态框ID
//});


function showPointErrorModal() {
    $("#pointErrorMessageModal").modal("show");
};
function hidePointErrorModal() {
    $("#pointErrorMessageModal").modal("hide");
};



function getJudgeResult(judgeId) {
    var progressData = [];
    var counter = 0;
    var lastProgressData = { x: 0, y: 0, z: 0, w: 0 };
    var iter = setInterval(getSingleJudgeResult, 500, judgeId);

    async function getSingleJudgeResult(judgeId) {
        let url_hasUser = "https://www.truemogician.com:1992/api/judgement/getStatus"
        let response_account = await axios.get(url_hasUser, {
            params: {
                judgementId: judgeId
            },
        })
        if (response_account.status == 200) {
            if (response_account.data.compiled == false) {
                $('#pointErrorMessageTitle').html('编译错误');
                $('#pointErrorMessageBody1').children().filter('div').eq(0).html('编译错误').show();
                $('#pointErrorMessageBody1').children().filter('div').eq(1).html(response_account.data.errorMessage).show();
                $('#pointErrorMessageBody2').children().filter('div').hide();
                $('#pointErrorMessageBody2').children().filter('div').hide();
                $('#pointErrorMessageBody3').children().filter('div').hide();
                $('#pointErrorMessageBody3').children().filter('div').hide();
                showPointErrorModal();
                clearInterval(iter);
            }
            else if (differed) {
                $('#pointErrorMessageTitle').html('测试点错误');
                $('#pointErrorMessageBody1').children().filter('div').eq(0).html('输入数据').show();
                $('#pointErrorMessageBody1').children().filter('div').eq(1).html(response_account.data.inputData).show();
                $('#pointErrorMessageBody2').children().filter('div').eq(0).html('正确数据').show();
                $('#pointErrorMessageBody2').children().filter('div').eq(1).html(response_account.data.answerData).show();
                $('#pointErrorMessageBody3').children().filter('div').eq(0).html('你的数据').show();
                $('#pointErrorMessageBody3').children().filter('div').eq(1).html(response_account.data.outputData).show();
                $('#WrongPointsPicture').html(1);
                showPointErrorModal();
                clearInterval(iter);
            }
        }
        else {
            $('#pointErrorMessageTitle').html('网络错误');
            $('#pointErrorMessageBody1').children().filter('div').eq(0).html('网络错误:' + String(response_account.status));
            $('#pointErrorMessageBody1').children().filter('div').eq(1).hide();
            $('#pointErrorMessageBody2').children().filter('div').eq(0).hide();
            $('#pointErrorMessageBody2').children().filter('div').eq(1).hide();
            $('#pointErrorMessageBody3').children().filter('div').eq(0).hide();
            $('#pointErrorMessageBody3').children().filter('div').eq(1).hide();
            showPointErrorModal();
            clearInterval(iter);
        }

        let maxTime = response_account.data.maxTime;
        let progress = response_account.data.progress;
        $('#judgeProgressBar').css('style:' + String(progress / maxTime * 100) + '%');
        $('#judgeProgressBar').html(progress + '/' + maxTime);

        $('#RightPointsPicture').html(progress);

        if (response_account.data.hasAnalysis) {
            let dmTime = response_account.data.totalTime.datamaker;
            let spTime = response_account.data.totalTime.standardProgram;
            let jpTime = response_account.data.totalTime.judgedProgram;
            let newProgressData = {
                x: progress,
                y: (dmTime - lastProgressData.y) / (progress - lastProgressData.x),
                z: (spTime - lastProgressData.z) / (progress - lastProgressData.x),
                w: (jpTime - lastProgressData.w) / (progress - lastProgressData.x)
            };
            lastProgressData = {
                x: progress,
                y: dmTime,
                z: spTime,
                w: jpTime
            };
            progressData.push(newProgressData);
            graph.setData(progressData);
        }
        if (maxTime == progress) {
            $('#pointErrorMessageTitle').html('全部通过！');
            $('#pointErrorMessageBody1').children().filter('div').eq(0).hide();
            $('#pointErrorMessageBody1').children().filter('div').eq(1).hide();
            $('#pointErrorMessageBody2').children().filter('div').eq(0).hide();
            $('#pointErrorMessageBody2').children().filter('div').eq(1).hide();
            $('#pointErrorMessageBody3').children().filter('div').eq(0).hide();
            $('#pointErrorMessageBody3').children().filter('div').eq(1).hide();
            showPointErrorModal();
            clearInterval(iter);
        }

    }
}


function custom_template(obj) {
    var data = $(obj.element).data();
    var text = $(obj.element).text();
    if (data && data["img_src"]) {
      img_src = data["img_src"];
      template = $(
        '<div><img src="' +
          img_src +
          '" style="height:40px;"/><span style="font-weight: 700;font-size:12pt;"> votes: ' +
          text +
          "</span></div>"
      );
      return template;
    }
  }
  var options = {
    templateSelection: custom_template,
    templateResult: custom_template,
  };
  $("#genSelect").select2(options);
  $("#standardSelect").select2(options);
  $(".select2-container--default .select2-selection--single").css({
    height: "50px",
    padding: "5px",
    width: "240px"
  });

// ok
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });


// toDelete
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

// toDelete
$("#problemList tbody").html(printProblemList(problem_lists));

// ok
function printProblemList(problemList){
    let tbodyContent = '';
    problemList.forEach((item, index) => {
        tbodyContent += `
        <tr>
        <td id="table_item_id_${index}">${item.id}</td>
        <td><a class="table_item" href="#judgementArea" onclick="problemToJudgement(${item.id})" >${item.title}</a></td>
        <td>${item.tags}</td>
        <td>${item.creatorId}</td>
        <td>${item.vote}</td>
    </tr>
        `; 
    })
    return tbodyContent;
}

// ok
function problemToJudgement(problemId){
    // $("#breadcrumbProblem").text("some problem");
    fromProblem();
    toJudgement(problemId);
}

// ok
async function updateProblemListArea(){
    // get all problems
    let allProblemsRes = await axios.get('/api/problem/getProblems');
    printProblemList(allProblemsRes.data);
    let avatorRes = await axios.get('/api/user/getAvator');
    updateUserAvator(avatorRes.data.avator);
}

// ok
function updateUserAvator(userAvator)
{
    let userAvatorArea = document.getElementById('currentUserAvator');
    userAvatorArea.innerHTML = '';
    let avatorImg = document.createElement('img');
    avatorImg.setAttribute('src', userAvator);
    avatorImg.setAttribute('class', 'img-rounded img-fluid img-thumbnail');
    avatorImg.setAttribute('style', 'height: 40px');
    userAvatorArea.appendChild(avatorImg);
}


// ok
$('#logout').on('click', () => {
    logout();
})

// ok
async function logout()
{
    let logoutRes = await axios.delete('/api/user/logout');
    window.location.href = './login.html';
}

const myData = {
    id: 3,
    title: "最小生成树",
    description: "#Hello world!",
    //tags: null
    tags: ['Prim', "Kruskal", "图", "树", "dp"]
}

let tagDescriptions = new Map();

updateJudgementArea(myData);

async function initTagDescription(tagList)
{
    let response = await axios.get("/api/tag/getDescriptions", {
        params: {
            names: tagList
        }
    });
    tagDescriptions = response.data;
}

function myInit(){
    let newTagDescriptions = new Map();
    newTagDescriptions.set('树', 'tree');
    newTagDescriptions.set('图', 'graph');
    newTagDescriptions.set('Prim', '普里姆');
    newTagDescriptions.set('Kruskal', '克鲁斯卡尔');
    tagDescriptions = newTagDescriptions;
}

async function setAuthorAvator(authorId){
    let response = await axios.get('/api/user/getAvator', {
        params:{
            userId: authorId
        }
    });
    let authorArea = document.getElementById("judgeProblemAuthor");
    let authorAvator = document.createElement('img');
    authorAvator.setAttribute('src', response.data.avator);
    authorAvator.setAttribute('class', 'img-rounded img-fluid img-thumbnail');
    authorAvator.setAttribute('style', 'height: 40px');
    authorArea.appendChild(authorAvator);
}

async function setContributorAvator(contributorsId){
    let contributorsNumber = contributorsId.length;
    let contributorsArea = document.getElementById('judgeProblemContributor');
    for(let i = 0; i < contributorsNumber; ++i)
    {
        let response = await axios.get('/api/user/getAvator', {
            params:{
                userId: contributorsId[i]
            }
        });
        let contributorAvator = document.createElement('img');
        contributorAvator.setAttribute('src', response.data.avator);
        contributorAvator.setAttribute('class', 'img-rounded img-fluid img-thumbnail');
        contributorAvator.setAttribute('style', 'height: 40px');
        contributorsArea.appendChild(contributorAvator);
    }
}

async function updateVoteStatus(problemId)
{
    // 获取投票状态
    let voteStatusRes = await axios.get('/api/user/hasVotedProblem', {
        params:{
            id: problemId
        }
    });
    let voteStatus = voteStatusRes.data.status;
    if(voteStatus === -1) // voteDown
    {
        document.getElementById("voteup").setAttribute("style", "filter: brightness(50%);");
        document.getElementById("votedown").setAttribute("style", "filter: brightness(150%);");
    }
    else if(voteStatus === 0) // noVote
    {
        document.getElementById("voteup").setAttribute("style", "filter: brightness(100%);");
        document.getElementById("votedown").setAttribute("style", "filter: brightness(100%);");
    }
    else // voteUp
    {
        document.getElementById("voteup").setAttribute("style", "filter: brightness(150%);");
        document.getElementById("votedown").setAttribute("style", "filter: brightness(50%);");
    }
    // 获取票数状态
    let voteResponse = await axios.get('/api/problem/getDetail', {
        params:{
            id:problemId
        }
    });
    $("#judgeProblemVotes").text(voteResponse.data.voteCount);
}


// ok
async function updateSelect(element, ids)
{
    let optionNumber = ids.length;
    for(let i = 0; i < optionNumber; ++i)
    {
        let sourceRes = await axios.get('/api/source/getSource', {
            params: {
                id: ids[i]
            }
        });
        let avatorResponse = await axios.get('/api/user/getAvator', {
            params: {
                userId: sourceRes.data.authorId
            }
        });
        let newOpt = document.createElement('option');
        newOpt.setAttribute('data-img_src', avatorResponse.data.avator);
        newOpt.setAttribute('param', ids[i]);
        let votes = document.createTextNode(sourceRes.data.voteUp - sourceRes.data.voteDown);
        newOpt.appendChild(votes);
        element.appendChild(newOpt);
    }
}

// ok delete comment when interface is ready
async function updateJudgementArea(problemId)
{   
    let problemResponse = await axios.get('/api/problem/getDetail', {
        params:{
            id:problemId
        }
    });
    let problemData = problemResponse.data;
    // id
    $("#judgeProblemId").text(problemData.id);
    // title
    $("#judgeProblemTitle").text(problemData.title);
    $("#modal-title").text(problemData.title);
    $("#breadcrumbProblem").text(problemData.title);
    $("#breadcrumbProblemResult").text(problemData.id + ' ' + problemData.title);
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
        // initTagDescription(problemData.tags);
        myInit();   // 接口写好之后改成上面的，并注释掉myInit
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
            //data-toggle="tooltip" data-placement="top" title="Tooltip on top"
            newTag.setAttribute('data-toggle', 'tooltip');
            newTag.setAttribute('data-placement', 'top');
            newTag.setAttribute('title', tagDescriptions.get(problemData.tags[i]));
            newTag.setAttribute('style', 'cursor: pointer;');
            h.appendChild(newTag);
            tagArea.appendChild(h);
        }
    }
    // authorId
    /* 下面这一部分在接口实现好之后取消注释
    document.getElementById("judgeProblemAuthor").innerHTML = '';
    setAuthorAvator(problemData.authorId);
    */
    //contributorsId
    //
    /* 下面这一部分在接口实现好之后取消注释
    // if(problemData.contributorsId)
    // {
    //     document.getElementById("judgeProblemContributor").innerHTML = '';
    //     setContributorsAvator(problemData.contibutorsId);
    // }
    // else
    // {
    //     document.getElementById("judgeProblemContributor").innerHTML = '<span class="text-secondary">暂无</span>';
    // }
    */
    //
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
    updateVoteStatus(problemData.id);
}

function judgementToProblems(){
    fromJudgement();
    toProblem();
}

// ok
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
    $("#problemList tbody").html(printProblemList(response.data));
}

const md_test = `
#hello world!
## interesting
`

var problem_data;

mdConverter(md_test);

$("#judge-view-area").on("change", () => {
    mdConverter($("#judge-view-area").text());
})

function mdConverter(md) {
    var converter = new showdown.Converter();  //增加拓展table
    converter.setOption('tables', true);  //启用表格选项。从showdown 1.2.0版开始，表支持已作为可选功能移入核心拓展，showdown.table.min.js扩展已被弃用
    var view = converter.makeHtml(md);
    document.getElementById("judge-view-area").innerHTML = view;
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
    selectStandard.innerHTML = '';
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


// 名字需要统一一下
form.addEventListener('formdata', (ev) => {
    let formdata = ev.formData;
    formdata.set('datagenId', parseInt($('#genSelect option:selected').attr('param')));
    formdata.set('standardId', parseInt($('#standardSelect option:selected').attr('param')));
    // axios({
    //     method: "POST",
    //     url: "/api/source/upload", //等待接口
    //     data: formdata
    // }).then((response) => {
    //     judgementToResult(response.data.judgementId);
    // });
    var dataobj = {};
    formdata.forEach((value, key) => dataobj[key] = value);
    var datajson = JSON.stringify(dataobj);
    //console.log(datajson);
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

function judgementToResult(problemId, judgementId)
{
    fromJudgement();
    toResult(judgementId);
}

function updateResultArea(judgementId)
{
    getJudgeResult(judgementId);
}

// ok
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
    });
    updateVoteStatus(parseInt($("#breadcrumbProblemResult").text().split(' ')[0]));
}

// ok
$("#voteUp").on("click", () => {
    vote(true);
});
$("#voteDown").on("click", () => {
    vote(false);
});

function resultToJudgement()
{
    let problemId = parseInt($("#breadcrumbProblemResult").text().split(' ')[0]);
    fromResult();
    toJudgement(problemId);
}

function toProblem()
{
    updateProblemListArea();
    $('#problemList').show();
}

function toJudgement(problemId)
{
    updateJudgementArea(problemId);
    $('#judgementArea').show();
}

function toResult(judgementId)
{
    updateResultArea(judgementId);
    $('#resultArea').show();
}

function fromProblem()
{
    $('#problemList').hide();
}

function fromJudgement()
{
    $('#judgementArea').hide();
}

function fromResult()
{
    $('#resultArea').hide();
}

$(() => {
    toProblem();
    $('#judgementArea').hide();
    $('#resultArea').hide();
});