// JavaScript source code
function mdConverter() {
    var md = document.getElementById("md-area").value;
    var converter = new showdown.Converter();  
    converter.setOption('tables', true);  
    var view = converter.makeHtml(md);
    document.getElementById("view-area").innerHTML = view;
}


function addButton(tag) {

    // let url = "https://www.truemogician.com:1992/api/tag/getAll";
    // let response = await axios.get(url);
    // if (response.status == 200)
    //     document.getElementById("tag_header").innerHTML = "问题tag申请成功";
    // else if (response.status == 404)
    //    document.getElementById("tag_header").innerHTML = "问题tag不存在";
    // else
    //     document.getElementById("tag_header").innerHTML = "问题tag申请失败";
    // tag = response.data;
    tag = ["Kruskal", "Prim", "dp"];
    for (let i = 0; i < tag.length; i++) {
        tag_chose[i] = 0;
        let butsNode = document.createElement("input");
        butsNode.type = "button";
        switch (i % 10) {
            case 0:
                butsNode.className = "ui red button";
                break;
            case 1:
                butsNode.className = "ui orange button";
                break;
            case 2:
                butsNode.className = "ui yellow button";
                break;
            case 3:
                butsNode.className = "ui olive button";
                break;
            case 4:
                butsNode.className = "ui green button";
                break;
            case 5:
                butsNode.className = "ui teal button";
                break;
            case 6:
                butsNode.className = "ui blue button";
                break;
            case 7:
                butsNode.className = "ui violet button";
                break;
            case 8:
                butsNode.className = "ui purple button";
                break;
            case 9:
                butsNode.className = "ui pink button";
                break;
        }

        butsNode.value = tag[i];
        butsNode.onclick = function () {
            if (tag_chose[i] == 0) {
                tag_chose[i] = 1;
                //num++;
                butsNode.className = "ui button";
            }
            else {
                tag_chose[i] = 0;
                switch (i % 10) {
                    case 0:
                        butsNode.className = "ui red button";
                        break;
                    case 1:
                        butsNode.className = "ui orange button";
                        break;
                    case 2:
                        butsNode.className = "ui yellow button";
                        break;
                    case 3:
                        butsNode.className = "ui olive button";
                        break;
                    case 4:
                        butsNode.className = "ui green button";
                        break;
                    case 5:
                        butsNode.className = "ui teal button";
                        break;
                    case 6:
                        butsNode.className = "ui blue button";
                        break;
                    case 7:
                        butsNode.className = "ui violet button";
                        break;
                    case 8:
                        butsNode.className = "ui purple button";
                        break;
                    case 9:
                        butsNode.className = "ui pink button";
                        break;
                }
            }
        };
        //butsNode.id = tag[i].name;

        let butsDivNode = document.getElementById("butsDiv");
        butsDivNode.appendChild(butsNode);
    }
}


async function create_problem() {
    // let problem_name = document.getElementById("problem_name").value;
    // let pro_description = document.getElementById("md-area").value;
    // let num = 0;
    // let problem_tag = new Array();
    // for (let i = 0; i < tag.length; i++)
    //     if (tag_chose[i] == 1) {
    //         problem_tag[num] = tag[i];
    //         num++;
    //     }
    // addButton(problem_tag);
    // let url = "https://www.truemogician.com:1992/api/problem/create";
    // let response = await axios.post(url, {
    //     params: {
    //         title: problem_name,

    //         description: pro_description,
    //         tags: problem_tag
    //     },
    // });
    // if (response.status == 201)
    //     document.getElementById('submit_information').innerHTML = "提交成功";
    // else
    //     document.getElementById('submit_information').innerHTML = "提交失败";

    window.location.href = "./index.html";

}
