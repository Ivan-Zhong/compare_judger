function change_input_style(inid,correct){
    if (correct==="false") {
            document.getElementById(inid).style.backgroundColor = "#FF6699";
            document.getElementById(inid).setAttribute("correct","false");
        } else {
            document.getElementById(inid).style.backgroundColor = "#FFFFFF";
            document.getElementById(inid).setAttribute("correct","true") ;
        }
}
async function judge_email(){
    let pattern_email = new RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);
    let data=document.getElementById("email").value;
    if (data != "") {
        if (!pattern_email.test(data)){
            change_input_style("email","false");
            return ;
        }
        else    change_input_style("email","correct");
    }
    let url="https://www.truemogician.com:1992/api/user/hasUser";
    let response=await axios.get(url,{
        params:{
            email:data
        },
    })
    if(response.status==200){
        if(response.data.exist){
            change_input_style("email","false");//false
            document.getElementById("sendmail button").className = "ui fluid disabled button "
            document.getElementById("sendmailinfo").innerHTML="账户已注册";
        }
        else{
            change_input_style("email","correct");
            document.getElementById("sendmail button").className = "positive fluid ui button"
            document.getElementById("sendmailinfo").innerHTML="发送验证码";
        }   
    }
}
function judge_if_correct(inid, pattern) {
    let pattern_email = new RegExp(pattern);
    let data = document.getElementById(inid).value;
    if (data != "") {
        if (!pattern_email.test(data)) {
            change_input_style(inid,"false");
        } else {
            change_input_style(inid,"correct");
        }
    }
    judge_if_all_correct();
}
function judge_length(inid) {
    let data = document.getElementById(inid).value;
    if (data != "") {
        if (data.length > 32) {
            change_input_style(inid,"false");
        } else {
            change_input_style(inid,"correct");
        }
    }
    judge_if_all_correct();
}
function judge_same() {
    let data1 = document.getElementById("password_one").value;
    let data2 = document.getElementById("password_two").value;
    if (data1 !== data2) {
        change_input_style("password_two","false");
    } else {
        change_input_style("password_two","correct");
    }
    judge_if_all_correct();
}
function judge_qq_phone(inid,pattern,length) {
    let numpattern = new RegExp(pattern);
    let data = document.getElementById(inid).value;
    if (data != "") {
        if (!numpattern.test(data)||data.length>length) {
            change_input_style(inid,"false");
        } else {
            change_input_style(inid,"true");
        }
    }
    judge_if_all_correct();
}
function judge_if_all_correct(){
    if(document.getElementById("email").getAttribute("correct") == "true"
    &&document.getElementById("name").getAttribute("correct") == "true"
    &&document.getElementById("password_one").getAttribute("correct") == "true"
    &&document.getElementById("password_two").getAttribute("correct") == "true"
    &&document.getElementById("qqid").getAttribute("correct") == "true"
    &&document.getElementById("authentic_input").getAttribute("correct") == "true"
    &&document.getElementById("phonenumber").getAttribute("correct") == "true"
    ){
        document.getElementById("register button").className = "positive ui fluid button ";
    }
    else {
        document.getElementById("register button").className = "ui fluid disabled button ";
    }
}
async function update_register_info(){
    let email_final=document.getElementById("email").value;
    let name_final=document.getElementById("name").value;
    let password_final=document.getElementById("password_one").value;
    let qq_final=document.getElementById("qqid").value;
    let phonenumber_final=document.getElementById("phonenumber").value;
    let authentic_final=document.getElementById("authentic_input").value;
    let url="https://www.truemogician.com:1992/api/user/register";
    let response=await axios.post(url,{
        data:{
            username:name_final,
            password:password_final,
            email:email_final,
            verificationCode:authentic_final,
            phonenumber:phonenumber_final,
            qq:qq_final,
        }
    })
    if(response.status==403){
        document.getElementById("createresponse").innerHTML="验证码错误！";
    }
    else if(response.status==201){
        let time=2;
        document.getElementById("createresponse").innerHTML="创建成功！";
        let counttime=setInterval(function(){
            time--;
            if(time==-1){
                clearInterval(counttime);
                location.href="./login.html";
            }
        },1000);
    }
}
async function send_mail_authentic(){
    let email_address=document.getElementById("email").value;
    document.getElementById("sendmail button").className="ui fluid disabled button "
    document.getElementById("authentic").className="ui left icon input";
    let time=59;
    let counttime=setInterval(function(){
        document.getElementById("sendmailinfo").innerHTML=time+"s";
        time--;
        if(time==-1){
            document.getElementById("sendmail button").className="positive fluid ui button";
            clearInterval(counttime);
            document.getElementById("sendmailinfo").innerHTML="发送验证码";
        }
    },1000);
    let url="https://www.truemogician.com:1992/api/user/sendEmail";
    let response=await axios.post(url,{
        params:{
            address:email_address
        }
    })
    if(response.status==200){
        document.getElementById("authentic").className="ui left icon input";
    }
}
function turn_password(){

}