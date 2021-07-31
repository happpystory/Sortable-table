const url = "https://services.odata.org/Trippin_Staging/(S(1pq1okp2nrkgscegtcku2srp))/People";

const beforeDataAppend = (columnId) => {
    //clear columns
    $("#t_body").html("")
    //restart sort signs
    $(".column_sign").html("")
    //disable clicking
    $(".header").css("pointerEvents", "none")
    //append loading image
    $("#t_body").append(`<tr>
    <td><img src="pictures/loading.gif" class="loadingImg"></td>
    <td><img src="pictures/loading.gif" class="loadingImg"></td>
    <td><img src="pictures/loading.gif" class="loadingImg"></td>
    <td><img src="pictures/loading.gif" class="loadingImg"></td>
    </tr>`)
    //remove data attribute to restart sort order
    const headerList = document.querySelectorAll(".header");
    headerList.forEach((e)=>{
        if(e.id != columnId) { 
            $(`#${e.id}`).removeData('order')
        }
    })
}

const afterDataAppend = () => {
    //enable clicking
    $(".header").css("pointerEvents", "inherit")
    //remove loading image
    $(".loadingImg").parent().parent().remove();
}

const addTableData = (data) => { 
    for(let i = 0; i < data.length; i++) { 
        $("#t_body").append(`<tr>
        <td>${data[i].UserName}</td>
        <td>${data[i].FirstName}</td>
        <td>${data[i].LastName}</td>
        <td>${data[i].Gender}</td></tr>`)
    } 
}

const setSortOrder = (columnId, signId) => {
    if($(`#${columnId}`).data('order') === undefined || $(`#${columnId}`).data('order') === 'none') { 
        $(`#${columnId}`).data('order', 'asc')
        //asc sign
        $(`#${signId}`).html("&#9650")
        return 1;
    }
    if($(`#${columnId}`).data('order') === 'asc') { 
        $(`#${columnId}`).data('order', 'desc')
        //desc sign
        $(`#${signId}`).html("&#9660")
        return -1;
    }
    if($(`#${columnId}`).data('order') === 'desc') { 
        $(`#${columnId}`).data('order', 'none')
        //remove sign
        $(`#${signId}`).html("")
        return 'none';
    }
}

const sortColumnData = (data, columnId, signId) => {
    let columnData = data
    const sortOrder = setSortOrder(columnId, signId)

    if(typeof sortOrder === 'number') { 
        columnData.sort((a, b)=> {
            const columnA = a[columnId];
            const columnB = b[columnId];

            return columnA > columnB ? sortOrder * 1 : sortOrder * -1;
         })
         addTableData(columnData)
    } else addTableData(columnData)
}

const addEventListeners = (columnId, signId) => {
    $(`#${columnId}`).click(()=>{
        beforeDataAppend(columnId)
        fetch(url)
        .then(val=>val.json())
        .then(val=>{
            afterDataAppend()
            sortColumnData(val.value, columnId, signId)
        })
    })
}

addEventListeners('UserName', 'userName_sign')
addEventListeners('FirstName', 'firstName_sign')
addEventListeners('LastName', 'lastName_sign')
addEventListeners('Gender', 'gender_sign')

$(document).ready(()=>{ 
    beforeDataAppend()
    fetch(url)
    .then(val => val.json())
    .then((val) => { 
       afterDataAppend()
       addTableData(val.value)
    })
    .catch(err => {
        console.log("Something went wrong!" + err)
    })
})




