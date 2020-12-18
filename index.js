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
        <td><a class="table_item" href="#judgement_area" onclick="transitToJudgement($('#table_item_id_${index}').text())" >${item.title}</a></td>
        <td>${item.tags}</td>
        <td>${item.creatorId}</td>
        <td>${item.vote}</td>
    </tr>
        `;  //这里需要修改，里面的参数传递要重新写，因为到下一个界面获得题目名称是从服务器获得的。
    })
    return tbodyContent;
}

$("#judgement_area").hide();
$("#result_area").hide();

function transitToJudgement(table_item_id){
    console.log(table_item_id);
    $("#breadcrumb_pos").text("some problem");
    $("#problem_list").hide();
    $("#judgement_area").show();
}

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
}

const md_test = `
#hello world!
## interesting
`

var problem_data;

mdConverter(md_test);

function mdConverter(md) {
    var converter = new showdown.Converter();  //增加拓展table
    converter.setOption('tables', true);  //启用表格选项。从showdown 1.2.0版开始，表支持已作为可选功能移入核心拓展，showdown.table.min.js扩展已被弃用
    var view = converter.makeHtml(md);
    document.getElementById("view-area").innerHTML = view;
}