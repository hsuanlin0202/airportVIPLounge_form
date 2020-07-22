$(document).ready(function () {
  init();

  // 新增會員資料--------------------------------------------
  $("#IdentityId").on("input", function () {
    id_check("IdentityId", "IdentityId_er");
  });

  $("#fullName").on("input", function () {
    words_check("fullName", 2, "fullName_er", "完整姓名");
  });

  $("#cardFront6").on("input", function () {
    words_check("cardFront6", 6, "cardFront6_er", "卡號前6碼");
  });

  $("#cardBack4").on("input", function () {
    words_check("cardBack4", 4, "cardBack4_er", "卡號後4碼");
  });

  // 新增會員資料填表用--------------------------------------------
  $("#cus_submit").click(function () {
    const verify = cus_submit();
    if (verify == 0) {
      console.log("可以拿去接API唷");
    }
  });

  // 填表用--------------------------------------------
  $("#submit").click(function () {
    var x = $("#HYForm").serializeArray();
    var jsonData = "{";
    var dataSource = x.length - 1;
    $.each(x, function (i, field) {
      if (dataSource > i) {
        jsonData +=
          '"' + field.name + '"' + ":" + '"' + field.value + '"' + ",";
      } else {
        jsonData +=
          '"' + field.name + '"' + ":" + '"' + field.value + '"' + "}";
      }
    });
    console.log(x);

    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/VIPReserveSubmit",
      data: jsonData,
      contentType: "application/json; charset=UTF-8",
      success: function (response) {
        var result = response;
        console.log("成功");
        console.log(result.RtnMessage);
        $.blockUI({
          message:
            '<div class="orderblockUI fx fx_center fx_wrap" style="padding:25px"><p style="width:100%;text-align:center;">' +
            result.RtnMessage +
            '<br><br></p><div id="sent_btn">確定</div></div>',
        });
        $("#sent_btn").click(function () {
          if (result.RtnStatusCode == "C") {
            window.location.href = "/estimatedReq";
          } else if (result.RtnStatusCode == "E") {
            window.location.href = "/estimatedReqSearch";
          }
        });
      },
      error: function (e) {
        console.log("失敗");
        $.blockUI({
          message:
            '<div class="orderblockUI fx fx_center fx_wrap" style="padding:25px"><p style="width:100%;text-align:center;">訂單修改失敗<br><br>請稍後再試</p><div id="sent_btn">確定</div></div>',
        });
        $("#sent_btn").click(function () {
          if (result.RtnStatusCode == "C") {
            // 傳進來的資料待提供
            window.location.href = "/estimatedReq";
          } else {
            window.location.href = "/estimatedReqSearch";
          }
        });
      },
      complete: function () {
        console.log("完成");
      },
    });
  });

  // 搜尋用--------------------------------------------
  $("#search").click(function () {
    var x = $("#search_from").serializeArray();
    var jsonData = "{";
    var dataSource = x.length - 1;
    $.each(x, function (i, field) {
      if (dataSource > i) {
        jsonData +=
          '"' + field.name + '"' + ":" + '"' + field.value + '"' + ",";
      } else {
        jsonData +=
          '"' + field.name + '"' + ":" + '"' + field.value + '"' + "}";
      }
    });
    console.log(x);
    // console.log(jsonData);
    search_ajax(jsonData);
  });

  const search_ajax = (jsonData) => {
    document.getElementById("searchResult").innerHTML = "";

    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/VIPReserveSearch",
      data: jsonData,
      contentType: "application/json; charset=UTF-8",
      success: function (response) {
        console.log(response);
        var reqList = response;

        var item = "";
        if (reqList.length <= 0) {
          item += '<div class="fx fx_center re_box flighnum">';
          item += "查無搜尋結果。</div>";
        } else {
          $.each(reqList, function (i, result) {
            // console.log(result);
            var entryType = result.EntryType;
            var entryTypeName = "";
            if ("arrival" == entryType) {
              entryType = "ari";
              entryTypeName = "入境";
            } else if ("departure" == entryType) {
              entryType = "dep";
              entryTypeName = "出境";
            } else if ("transfer" == entryType) {
              entryType = "tran";
              entryTypeName = "轉機";
            }

            item +=
              '<div id="' +
              result.OrderNo +
              '_box" class="wid80 fx fx_acenter fx_wrap">';
            item +=
              '<div class="wid100 create_date">需求單建立日期：' +
              result.CreateDateString +
              "</div>";
            item +=
              '<div class="sect_box re_box wid100 fx fx_acenter fx_wrap">';
            item += '<div class="fx fx_between wid100">';
            item += '<div class="orderno">' + result.OrderNo + "</div>";
            item +=
              '<div class="flight_type ' +
              entryType +
              '">' +
              entryTypeName +
              "</div>";
            item += "</div>";
            item +=
              '<div class="wid100 fx fx_nowrap fx_acenter" style="margin-top: 5px;">';
            item += '<img src="img/ic_airplane.svg" style="width: 36px;" />';
            item += '<div class="wid100 flighnum fx fx_wrap">';
            item += "<label>" + result.DepartureFlightNo + "</label>";
            item += '<label class="dash">-</label>';
            item +=
              '<label class="flight_time">' +
              result.DepartureDateString +
              "</label>";
            item += "</div>";
            item += "</div>";
            item += '<div class="wid100 fx fx_nowrap">';
            item += '<div class="customer wid80 fx fx_wrap">';
            item += '<div class="cus_info">';
            item += '<div class="cus_title wid100">姓名</div>';
            item +=
              '<div class="cus_name wid100">' + result.VipNameTw + "</div>";
            item += "</div>";
            item += '<div class="cus_info">';
            item += '<div class="cus_title wid100">手機號碼</div>';
            item +=
              '<div class="cus_name wid100">' +
              result.VipMobilePhone +
              "</div>";
            item += "</div>";
            item += '<div class="cus_info">';
            item += '<div class="cus_title wid100">身分證字號</div>';
            item +=
              '<div class="cus_name wid100">' + result.VipPassportNo + "</div>";
            item += "</div>";
            item += "</div>";
            item += "</div>";
            item += '<div class="wid100 btns_box fx fx_nowrap fx_end">';
            item +=
              '<div class="btn edit" onclick="window.location.href =\'/estimatedReqReadonly/' +
              result.OrderNo +
              "'\">檢視</div>";
            item +=
              '<div class="btn edit" onclick="window.location.href =\'/estimatedReq/' +
              result.OrderNo +
              "'\">編輯</div>";
            item +=
              '<div class="btn del" id="' + result.OrderNo + '">刪除</div>';
            item += "</div>";
            item += "</div></div>";
          });
        }
        document.getElementById("searchResult").innerHTML = item;
      },
      error: function (e) {
        console.log("搜尋失敗");
        var item = "";
        item += '<div class="fx fx_center re_box flighnum">';
        item += "查無搜尋結果。</div>";
        document.getElementById("searchResult").innerHTML = item;
      },
      complete: function () {
        console.log("搜尋完成");

        $(".del").click(function () {
          const orderno = $(this).val(name)[0].id;
          $("#type_picked").val(orderno);
          if (confirm("是否要刪除訂單： " + orderno + " ？")) {
            VIPReserveDelete(orderno);
          } else {
          }
        });
      },
    });
  };

  // 刪除用--------------------------------------------
  const VIPReserveDelete = (orderno) => {
    console.log(orderno + "被刪掉了!!");
    var jsonData = '{"OrderNo":"' + orderno + '"}';
    $.ajax({
      type: "POST",
      dataType: "json",
      data: jsonData,
      url: "/VIPReserveDelete",
      contentType: "application/json; charset=UTF-8",
      success: function (response) {
        console.log("刪除成功");
        $("#" + orderno + "_box").hide();
      },
      error: function (e) {
        console.log("刪除失敗");
      },
      complete: function () {
        console.log("刪除完成");
      },
    });
  };

  // 班機資料--------------------------------------------
  // 航班日期_y
  $("#entry_date_y").change(function () {
    select_check("entry_date_m", "entrydate_er", "日期");
    entrydate_combine();
  });

  // 航班日期_m
  $("#entry_date_m").change(function () {
    updateNumberOfDays("entry_date_y", "entry_date_m", "entry_date_d");
    select_check("entry_date_y", "entrydate_er", "日期");
    entrydate_combine();
  });

  // 航班日期_d
  $("#entry_date_d").change(function () {
    entrydate_combine();
  });

  // 出境時間_h
  $("#departure_time_h").change(function () {
    select_check("departure_time_m", "departuretime_er", "出境時間");
    entrydate_combine();
  });

  // 出境時間_m
  $("#departure_time_m").change(function () {
    select_check("departure_time_h", "departuretime_er", "出境時間");
    entrydate_combine();
  });

  // 入境時間_h
  $("#arrival_time_h").change(function () {
    select_check("arrival_time_m", "arrivaltime_er", "入境時間");
    entrydate_combine();
  });

  // 入境時間_m
  $("#arrival_time_m").change(function () {
    select_check("arrival_time_h", "arrivaltime_er", "入境時間");
    entrydate_combine();
  });

  // vip時間_h
  $("#vip_time_h").change(function () {
    select_check("vip_time_m", "EstimatedArrivalHYTime_er", "抵達時間");
    entrydate_combine();
  });

  // vip時間_m
  $("#vip_time_m").change(function () {
    select_check("vip_time_h", "EstimatedArrivalHYTime_er", "抵達時間");
    entrydate_combine();
  });

  // 出境航班編號
  $("#DepartureFlightNo").on("input", function () {
    words_check("DepartureFlightNo", 4, "DepartureFlightNo_er", "出境班機號碼");
    entryno_combine();
  });

  // 入境航班編號
  $("#ArrivalFlightNo").on("input", function () {
    words_check("ArrivalFlightNo", 4, "ArrivalFlightNo_er", "入境班機號碼");
    entryno_combine();
  });

  // 貴賓基本資料--------------------------------------------
  // 中文姓/名
  $("#VipNameTW").on("input", function () {
    words_check("VipNameTW", 2, "VipNameTW_er", "完整姓名");
  });

  // 護照上英文姓
  $("#VipLastNameEN").on("input", function () {
    words_check("VipLastNameEN", 2, "VipLastNameEN_er", "完整英文姓氏");
  });

  // 護照上英文名
  $("#VipFirstNameEN").on("input", function () {
    words_check("VipFirstNameEN", 2, "VipFirstNameEN_er", "完整英文名");
  });

  // 國籍
  $("#VipCountry").on("input", function () {
    words_check("VipCountry", 2, "VipCountry_er", "完整國籍");
  });

  // 護照號碼
  $("#VipPassportNo").on("input", function () {
    words_check("VipPassportNo", 6, "VipPassportNo_er", "完整護照號碼");
  });

  // 護照有效期限
  $("#passport_exp_y").change(function () {
    select_check("passport_exp_m", "PassportExpDate_er", "護照有效期限");
    date_combine(
      "passport_exp_y",
      "passport_exp_m",
      "passport_exp_d",
      "PassportExpDate"
    );
  });

  $("#passport_exp_m").change(function () {
    select_check("passport_exp_y", "PassportExpDate_er", "護照有效期限");
    updateNumberOfDays("passport_exp_y", "passport_exp_m", "passport_exp_d");
    date_combine(
      "passport_exp_y",
      "passport_exp_m",
      "passport_exp_d",
      "PassportExpDate"
    );
  });

  $("#passport_exp_d").change(function () {
    select_check("passport_exp_y", "PassportExpDate_er", "護照有效期限");
    date_combine(
      "passport_exp_y",
      "passport_exp_m",
      "passport_exp_d",
      "PassportExpDate"
    );
  });

  // VIP出生年/月/日
  $("#vipbirthday_y").change(function () {
    select_check("vipbirthday_m", "VipBirthday_er", "出生年月日");
    date_combine(
      "vipbirthday_y",
      "vipbirthday_m",
      "vipbirthday_d",
      "VipBirthday"
    );
  });

  $("#vipbirthday_m").change(function () {
    updateNumberOfDays("vipbirthday_y", "vipbirthday_m", "vipbirthday_d");
    select_check("vipbirthday_y", "VipBirthday_er", "出生年月日");
    date_combine(
      "vipbirthday_y",
      "vipbirthday_m",
      "vipbirthday_d",
      "VipBirthday"
    );
  });

  $("#vipbirthday_d").change(function () {
    select_check("vipbirthday_y", "VipBirthday_er", "出生年月日");
    date_combine(
      "vipbirthday_y",
      "vipbirthday_m",
      "vipbirthday_d",
      "VipBirthday"
    );
  });

  // 行動電話
  $("#VipMobilePhone").on("input", function () {
    mobile_check("VipMobilePhone", "VipMobilePhone_er", "m");
  });

  // 市話
  $("#VipTel").on("input", function () {
    mobile_check("VipTel", "VipTel_er", "t");
  });

  // 傳真
  $("#VipFax").on("input", function () {
    mobile_check("VipFax", "VipFax_er", "t");
  });

  // Email
  $("#VipEmail").on("input", function () {
    email_check("VipEmail", "VipEmail_er");
  });

  // 聯絡人資料--------------------------------------------
  // 本人與否
  $("input[name='ContactIsSelf']").click(function () {
    contact_info();
  });

  // 姓名
  $("#ContactName").on("input", function () {
    words_check("ContactName", 2, "ContactName_er", "完整姓名");
  });

  // 職稱
  $("#ContactJobTitle").on("input", function () {
    words_check("ContactJobTitle", 2, "ContactJobTitle_er", "完整職稱");
  });

  // 公司名稱
  $("#ContactCompanyName").on("input", function () {
    words_check("ContactCompanyName", 2, "ContactCompanyName_er", "公司名稱");
  });

  // 付款方式待確認

  // 統一編號不一定要填？

  // 發票寄送地址
  $("#InvoiceAddress").on("input", function () {
    words_check("InvoiceAddress", 10, "InvoiceAddress_er", "發票寄送地址");
  });

  // 行動電話
  $("#ContactMobilePhone").on("input", function () {
    mobile_check("ContactMobilePhone", "ContactMobilePhone_er", "m");
  });

  // 市話
  $("#ContactTel").on("input", function () {
    mobile_check("ContactTel", "ContactTel_er", "t");
  });

  // 傳真
  $("#ContactFax").on("input", function () {
    mobile_check("ContactFax", "ContactFax_er", "t");
  });

  // Email
  $("#ContactEmail").on("input", function () {
    email_check("ContactEmail", "ContactEmail_er");
  });

  // 接送駕駛資料--------------------------------------------
  // 姓名
  $("#DriverName").on("input", function () {
    words_check("DriverName", 2, "DriverName_er", "完整姓名");
  });

  // 接送駕駛出生年/月/日
  $("#driverbday_y").change(function () {
    select_check("driverbday_m", "DriverBirthday_er", "出生年月日");
    date_combine(
      "driverbday_y",
      "driverbday_m",
      "driverbday_d",
      "DriverBirthday"
    );
  });

  $("#driverbday_m").change(function () {
    updateNumberOfDays("driverbday_y", "driverbday_m", "driverbday_d");
    select_check("driverbday_y", "DriverBirthday_er", "出生年月日");
    date_combine(
      "driverbday_y",
      "driverbday_m",
      "driverbday_d",
      "DriverBirthday"
    );
  });

  $("#driverbday_d").change(function () {
    select_check("driverbday_y", "DriverBirthday_er", "出生年月日");
    date_combine(
      "driverbday_y",
      "driverbday_m",
      "driverbday_d",
      "DriverBirthday"
    );
  });

  // 身分證號碼
  $("#DriverIdNo").on("input", function () {
    id_check("DriverIdNo", "DriverIdNo_er");
  });

  // 行動電話
  $("#DriverMobilePhone").on("input", function () {
    mobile_check("DriverMobilePhone", "DriverMobilePhone_er", "m");
  });

  // 戶籍地址
  $("#DriverAddress").on("input", function () {
    words_check("DriverAddress", 7, "DriverAddress_er", "戶籍地址");
  });

  // 車輛型別???

  // 車牌號碼
  $("#CarNo").on("input", function () {
    words_check("CarNo", 5, "CarNo_er", "車牌號碼");
  });

  // 接送機人員資料--------------------------------------------
  // 姓名
  $("#PickerName").on("input", function () {
    words_check("PickerName", 2, "PickerName_er", "完整姓名");
  });

  // 身分證號碼
  $("#PickerIdNo").on("input", function () {
    id_check("PickerIdNo", "PickerIdNo_er");
  });

  // 接送機人員出生年/月/日
  $("#pickerbday_y").change(function () {
    select_check("pickerbday_m", "PickerBirthday_er", "出生年月日");
    date_combine(
      "pickerbday_y",
      "pickerbday_m",
      "pickerbday_d",
      "PickerBirthday"
    );
  });

  $("#pickerbday_m").change(function () {
    updateNumberOfDays("pickerbday_y", "pickerbday_m", "pickerbday_d");
    select_check("pickerbday_y", "PickerBirthday_er", "出生年月日");
    date_combine(
      "pickerbday_y",
      "pickerbday_m",
      "pickerbday_d",
      "PickerBirthday"
    );
  });

  $("#pickerbday_d").change(function () {
    select_check("pickerbday_y", "PickerBirthday_er", "出生年月日");
    date_combine(
      "pickerbday_y",
      "pickerbday_m",
      "pickerbday_d",
      "PickerBirthday"
    );
  });

  // 護照號碼/中港澳入台證號
  $("#PickerPassportNo").on("input", function () {
    words_check(
      "PickerPassportNo",
      6,
      "PickerPassportNo_er",
      "護照號碼/中港澳入台證號"
    );
  });

  // 行動電話
  $("#PickerMobilePhone").on("input", function () {
    mobile_check("PickerMobilePhone", "PickerMobilePhone_er", "m");
  });

  // 戶籍地址
  $("#PickerAddress").on("input", function () {
    words_check("PickerAddress", 7, "PickerAddress_er", "戶籍地址");
  });

  $("input[name='InvoiceType']").click(function () {
    invoice();
  });

  $("input[name='tex_free']").click(function () {
    tex_free();
  });

  $("input[name='tex_refund']").click(function () {
    tex_refund();
  });

  // 搜尋日期-開始
  $("#ser_date_st_y").change(function () {
    date_combine(
      "ser_date_st_y",
      "ser_date_st_m",
      "ser_date_st_d",
      "DepartureDateBegin"
    );
  });

  $("#ser_date_st_m").change(function () {
    updateNumberOfDays("ser_date_st_y", "ser_date_st_m", "ser_date_st_d");
    date_combine(
      "ser_date_st_y",
      "ser_date_st_m",
      "ser_date_st_d",
      "DepartureDateBegin"
    );
  });

  $("#ser_date_st_d").change(function () {
    date_combine(
      "ser_date_st_y",
      "ser_date_st_m",
      "ser_date_st_d",
      "DepartureDateBegin"
    );
  });

  // 搜尋日期-結束
  $("#ser_date_ed_y").change(function () {
    date_combine(
      "ser_date_ed_y",
      "ser_date_ed_m",
      "ser_date_ed_d",
      "DepartureDateEnd"
    );
  });

  $("#ser_date_ed_m").change(function () {
    updateNumberOfDays("ser_date_ed_y", "ser_date_ed_m", "ser_date_ed_d");
    date_combine(
      "ser_date_ed_y",
      "ser_date_ed_m",
      "ser_date_ed_d",
      "DepartureDateEnd"
    );
  });

  $("#ser_date_ed_d").change(function () {
    date_combine(
      "ser_date_ed_y",
      "ser_date_ed_m",
      "ser_date_ed_d",
      "DepartureDateEnd"
    );
  });
});

const init = () => {
  // init flight_info
  flight_info();

  // init entry_date
  future_date_factory("entry_date_y", "entry_date_m", "entry_date_d");
  const entry_datev_y = $("#entry_datev_y").val();
  const entry_datev_m = $("#entry_datev_m").val();
  const entry_datev_d = $("#entry_datev_d").val();
  if (entry_datev_y != null || entry_datev_y != "") {
    $("#entry_date_y").val(entry_datev_y);
    $("#entry_date_m").val(entry_datev_m);
    updateNumberOfDays("entry_date_y", "entry_date_m", "entry_date_d");
    $("#entry_date_d").val(entry_datev_d);
  }

  // init departure_time
  time_factory("departure_time_h", "departure_time_m");
  const departure_timev_h = $("#departure_timev_h").val();
  const departure_timev_m = $("#departure_timev_m").val();
  if (departure_timev_h != null || departure_timev_h != "") {
    $("#departure_time_h").val(departure_timev_h);
    $("#departure_time_m").val(departure_timev_m);
  }

  // init arrival_time
  time_factory("arrival_time_h", "arrival_time_m");
  const arrival_timev_h = $("#arrival_timev_h").val();
  const arrival_timev_m = $("#arrival_timev_m").val();
  if (arrival_timev_h != null || arrival_timev_h != "") {
    $("#arrival_time_h").val(arrival_timev_h);
    $("#arrival_time_m").val(arrival_timev_m);
  }

  // init vip_time
  time_factory("vip_time_h", "vip_time_m");
  const vip_timev_h = $("#vip_timev_h").val();
  const vip_timev_m = $("#vip_timev_m").val();
  if (vip_timev_h != null || vip_timev_h != "") {
    $("#vip_time_h").val(vip_timev_h);
    $("#vip_time_m").val(vip_timev_m);
  }

  // init passport_exp
  future_date_factory("passport_exp_y", "passport_exp_m", "passport_exp_d");
  const passport_expv_y = $("#passport_expv_y").val();
  const passport_expv_m = $("#passport_expv_m").val();
  const passport_expv_d = $("#passport_expv_d").val();
  if (passport_expv_y != null || passport_expv_y != "") {
    $("#passport_exp_y").val(passport_expv_y);
    $("#passport_exp_m").val(passport_expv_m);
    updateNumberOfDays("passport_exp_y", "passport_exp_m", "passport_exp_d");
    $("#passport_exp_d").val(passport_expv_d);
  }

  // init vipbirthday
  date_factory("vipbirthday_y", "vipbirthday_m", "vipbirthday_d");
  const vipbirthdayv_y = $("#vipbirthdayv_y").val();
  const vipbirthdayv_m = $("#vipbirthdayv_m").val();
  const vipbirthdayv_d = $("#vipbirthdayv_d").val();
  if (vipbirthdayv_y != null || vipbirthdayv_y != "") {
    $("#vipbirthday_y").val(vipbirthdayv_y);
    $("#vipbirthday_m").val(vipbirthdayv_m);
    updateNumberOfDays("vipbirthday_y", "vipbirthday_m", "vipbirthday_d");
    $("#vipbirthday_d").val(vipbirthdayv_d);
  }

  // init contact_info;
  const contactisselfv = $("#contactisselfv").val();
  if (contactisselfv != null || contactisselfv != "") {
    $("input[name=ContactIsSelf][value='" + contactisselfv + "']").attr(
      "checked",
      true
    );
  }
  contact_info();

  // init sex
  const vipsexv = $("#vipsexv").val();
  if (vipsexv != null || vipsexv != "") {
    $("#VipSex").val(vipsexv);
  }

  // init invoice
  const InvoiceType = $("#InvoiceType").val();
  if (InvoiceType != null || InvoiceType != "") {
    $("input[name=invoice][value='" + InvoiceType + "']").attr("checked", true);
  }

  // init PaymentMethod
  const paymentmethodv = $("#paymentmethodv").val();
  if (paymentmethodv != null || paymentmethodv != "") {
    // console.log(paymentmethodv);
    $("#PaymentMethod").val(paymentmethodv);
  }

  // init driverbday
  date_factory("driverbday_y", "driverbday_m", "driverbday_d");
  const driverbdayv_y = $("#driverbdayv_y").val();
  const driverbdayv_m = $("#driverbdayv_m").val();
  const driverbdayv_d = $("#driverbdayv_d").val();
  if (driverbdayv_y != null || driverbdayv_y != "") {
    $("#driverbday_y").val(driverbdayv_y);
    $("#driverbday_m").val(driverbdayv_m);
    updateNumberOfDays("driverbday_y", "driverbday_m", "driverbday_d");
    $("#driverbday_d").val(driverbdayv_d);
  }

  // init pickerbday
  date_factory("pickerbday_y", "pickerbday_m", "pickerbday_d");
  const pickerbdayv_y = $("#pickerbdayv_y").val();
  const pickerbdayv_m = $("#pickerbdayv_m").val();
  const pickerbdayv_d = $("#pickerbdayv_d").val();
  if (pickerbdayv_y != null || pickerbdayv_y != "") {
    $("#pickerbday_y").val(pickerbdayv_y);
    $("#pickerbday_m").val(pickerbdayv_m);
    updateNumberOfDays("pickerbday_y", "pickerbday_m", "pickerbday_d");
    $("#pickerbday_d").val(pickerbdayv_d);
  }

  // init ser_date_st
  search_date_factory("ser_date_st_y", "ser_date_st_m", "ser_date_st_d");

  // init ser_date_ed
  search_date_factory("ser_date_ed_y", "ser_date_ed_m", "ser_date_ed_d");

  // init isremindv
  const isremindv = $("#isremindv").val();
  if (isremindv != null || isremindv != "") {
    $("input[name=IsRemind][value='" + isremindv + "']").attr("checked", true);
  }

  // init istaxrefundv
  const istaxrefundv = $("#istaxrefundv").val();
  if (istaxrefundv != null || istaxrefundv != "") {
    $("input[name=IsTaxRefund][value='" + istaxrefundv + "']").attr(
      "checked",
      true
    );
  }
};

// 航班資料
const flight_info = () => {
  $("#arrival_box").show();
  $("#departure_box").show();
  $("#entryVIP_box").show();
  const entry_type = $("#entry_type").val();
  if (entry_type == "departure") {
    $("#arrival_box").hide();
  } else if (entry_type == "arrival") {
    $("#departure_box").hide();
    $("#entryVIP_box").hide();
  } else if (entry_type == "transfer") {
    $("#entryVIP_box").hide();
  }
};

// 航班時間
const entrydate_combine = () => {
  const entry_type = $("#entry_type").val();
  const yy = $("#entry_date_y").val();
  const mm = $("#entry_date_m").val();
  const dd = $("#entry_date_d").val();
  const dehour = $("#departure_time_h").val();
  const demin = $("#departure_time_m").val();
  const arhour = $("#arrival_time_h").val();
  const armin = $("#arrival_time_m").val();
  if (entry_type == "departure") {
    $("#DepartureDate").val(
      yy + "/" + mm + "/" + dd + " " + dehour + ":" + demin + ":00"
    );
  } else if (entry_type == "arrival") {
    $("#ArrivalDate").val(
      yy + "/" + mm + "/" + dd + " " + arhour + ":" + armin + ":00"
    );
  } else if (entry_type == "transfer") {
    $("#TransferDepartureDate").val(
      yy + "/" + mm + "/" + dd + " " + dehour + ":" + demin + ":00"
    );
    $("#TransferArrivalDate").val(
      yy + "/" + mm + "/" + dd + " " + arhour + ":" + armin + ":00"
    );
  }
};

// 航班編號
const entryno_combine = () => {
  const entry_type = $("#entry_type").val();
  const deno = $("#DepartureFlightNo").val();
  const arno = $("#ArrivalFlightNo").val();
  if (entry_type == "transfer") {
    $("#TransferDepartureFlightNo").val(deno);
    $("#TransferArrivalFlightNo").val(arno);
  }
};

// 選擇器驗證
const select_check = (cur_input, cur_er, cur_title) => {
  const cur = $("#" + cur_input).val();
  if (cur == 0 || cur == null) {
    $("#" + cur_er).html("請選擇" + cur_title);
  } else {
    $("#" + cur_er).html("");
  }
};

// 字數驗證
const words_check = (cur_input, exp_num, cur_er, cur_title) => {
  const cur = $("#" + cur_input).val();
  if (cur.length < exp_num) {
    $("#" + cur_er).html("請填入正確的" + cur_title);
  } else {
    $("#" + cur_er).html("");
  }
};

// 其他日期合成
const date_combine = (year, month, day, target) => {
  const yy = $("#" + year).val();
  const mm = $("#" + month).val();
  const dd = $("#" + day).val();
  $("#" + target).val(yy + "/" + mm + "/" + dd);
  // console.log(target + ": " + $("#" + target).val());
};

// 聯絡人資料
const contact_info = () => {
  const re = $("input[name='ContactIsSelf']:checked").val();
  if (re != "N") {
    $("#contact_info").hide();
  } else {
    $("#contact_info").show();
  }
};

// 發票資料
const invoice = () => {
  const re = $("input[name='InvoiceType']:checked").val();
  $("#InvoiceType").val(re);
};

// 免稅商品
const tex_free = () => {
  const re = $("input[name='tex_free']:checked").val();
  $("#IsRemind").val(re);
};

// 退稅服務
const tex_refund = () => {
  const re = $("input[name='tex_refund']:checked").val();
  $("#IsTaxRefund").val(re);
};

// 日期產生
const date_factory = (years, months, days) => {
  for (i = new Date().getFullYear(); i > 1900; i--) {
    $("#" + years).append($("<option />").val(i).html(i));
  }

  for (i = 1; i < 13; i++) {
    i < 10
      ? $("#" + months).append(
          $("<option />")
            .val("0" + i)
            .html("0" + i)
        )
      : $("#" + months).append($("<option />").val(i).html(i));
  }
};

// 未來日期產生
const future_date_factory = (years, months, days) => {
  const cur_year = new Date().getFullYear();
  for (i = cur_year; i <= cur_year + 15; i++) {
    $("#" + years).append($("<option />").val(i).html(i));
  }

  for (i = 1; i < 13; i++) {
    i < 10
      ? $("#" + months).append(
          $("<option />")
            .val("0" + i)
            .html("0" + i)
        )
      : $("#" + months).append($("<option />").val(i).html(i));
  }
};

// 搜尋日期產生
const search_date_factory = (years, months, days) => {
  const cur_year = new Date().getFullYear();
  for (i = cur_year - 10; i <= cur_year + 10; i++) {
    $("#" + years).append($("<option />").val(i).html(i));
  }

  for (i = 1; i < 13; i++) {
    i < 10
      ? $("#" + months).append(
          $("<option />")
            .val("0" + i)
            .html("0" + i)
        )
      : $("#" + months).append($("<option />").val(i).html(i));
  }
};

const daysInMonth = (years, month) => {
  return new Date(years, month, 0).getDate();
};

const updateNumberOfDays = (years, months, days) => {
  $("#" + days).html("");
  var mm = $("#" + months).val();
  var yy = $("#" + years).val();
  var dd = daysInMonth(yy, mm);
  for (i = 1; i <= dd; i++) {
    i < 10
      ? $("#" + days).append(
          $("<option />")
            .val("0" + i)
            .html("0" + i)
        )
      : $("#" + days).append($("<option />").val(i).html(i));
  }
};

// 時間產生
const time_factory = (hours, minutes) => {
  for (i = 0; i < 24; i++) {
    i < 10
      ? $("#" + hours).append(
          $("<option />")
            .val("0" + i)
            .html("0" + i)
        )
      : $("#" + hours).append($("<option />").val(i).html(i));
  }

  for (j = 0; j < 60; j++) {
    j < 10
      ? $("#" + minutes).append(
          $("<option />")
            .val("0" + j)
            .html("0" + j)
        )
      : $("#" + minutes).append($("<option />").val(j).html(j));
  }
};

const mobile_check = (cur, cur_er, type) => {
  var phone = $("#" + cur).val();
  var rule_m = /[0-9]{8}$/;
  var rule_t = /^0\d{1}-?\d{7,8}$/;
  if (type == "m") {
    if (rule_m.test(phone)) {
      $("#" + cur_er).html("");
    } else {
      $("#" + cur_er).html("請輸入正確的行動電話號碼格式");
    }
  } else if (type == "t") {
    if (rule_t.test(phone)) {
      $("#" + cur_er).html("");
    } else {
      $("#" + cur_er).html("請輸入正確的電話號碼格式");
    }
  }
};

const email_check = (cur, cur_er) => {
  var email = $("#" + cur).val();
  var rule = /[\w-.]+@[\w-]+(.[\w_-]+)+/;
  if (rule.test(email) != true) {
    $("#" + cur_er).html("請輸入正確的E-mail");
  } else {
    $("#" + cur_er).html("");
  }
};

const id_check = (cur, cur_er) => {
  const idnum = $("#" + cur).val();
  if (checkPid(idnum)) {
    $("#" + cur_er).html("");
  } else {
    $("#" + cur_er).html("請輸入正確的身分證字號");
  }
};

const checkPid = (id) => {
  tab = "ABCDEFGHJKLMNPQRSTUVWXYZIO";
  A1 = new Array(
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    3
  );
  A2 = new Array(
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    0,
    1,
    2,
    3,
    4,
    5
  );
  Mx = new Array(9, 8, 7, 6, 5, 4, 3, 2, 1, 1);

  if (id.length != 10) return false;
  i = tab.indexOf(id.charAt(0));
  if (i == -1) return false;
  sum = A1[i] + A2[i] * 9;

  for (i = 1; i < 10; i++) {
    v = parseInt(id.charAt(i));
    if (isNaN(v)) return false;
    sum = sum + v * Mx[i];
  }
  if (sum % 10 != 0) return false;
  return true;
};

const cus_submit = () => {
  id_check("IdentityId", "IdentityId_er");
  words_check("fullName", 2, "fullName_er", "完整姓名");
  words_check("cardFront6", 6, "cardFront6_er", "卡號前6碼");
  words_check("cardBack4", 4, "cardBack4_er", "卡號後4碼");
  const IdentityId = $("#IdentityId_er").html().length;
  const fullName = $("#fullName_er").html().length;
  const cardFront6 = $("#cardFront6_er").html().length;
  const cardBack4 = $("#cardBack4_er").html().length;
  const verify = IdentityId + fullName + cardFront6 + cardBack4;
  return verify;
};
