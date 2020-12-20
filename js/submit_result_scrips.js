
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



function GetJudgeResult(problemId) {
    var progressData = [];
    var counter = 0;
    var lastProgressData = { x: 0, y: 0, z: 0, w: 0 };
    var iter = setInterval(getSingleJudgeResult, 500, problemId);

    async function getSingleJudgeResult(problemId) {
        let url_hasUser = "https://www.truemogician.com:1992/api/judgement/getStatus"
        let response_account = await axios.get(url_hasUser, {
            params: {
                judgementId: problemId
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
