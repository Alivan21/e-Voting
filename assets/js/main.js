document.addEventListener("DOMContentLoaded", function () {
  const dataVoteUsers = [];
  const RENDER_EVENT = "render-vote";
  const SAVED_USER = "saved-users";
  const USER_STORAGE_KEY = "VOTE_APPS";
  const sumbitLogin = document.getElementById("form");

  const voteBtn1 = document.getElementById("vote1");
  const voteBtn2 = document.getElementById("vote2");
  const elemenHasil = document.getElementById("pemenang");

  if (elemenHasil) {
    winner();
  }

  if (sumbitLogin) {
    sumbitLogin.addEventListener("submit", function (event) {
      event.preventDefault();
      if (isEmpty()) {
        alert("Email dan atau nama tidak boleh kosong");
      } else {
        addVoteUser();
        saveData();
        window.location.href = "vote.html";
      }
    });
  }

  if (voteBtn1) {
    voteBtn1.addEventListener("click", function () {
      for (const voteItem of dataVoteUsers) {
        voteNumber1(voteItem.id);
      }
    });
  }

  if (voteBtn2) {
    voteBtn2.addEventListener("click", function () {
      for (const voteItem of dataVoteUsers) {
        voteNumber2(voteItem.id);
      }
    });
  }

  function isEmpty() {
    const email = document.getElementById("email").value;
    const nama = document.getElementById("name").value;
    if (email.length == 0 || nama.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  function generateUser(id, email, nama, isVote, voteNumber, result1, result2) {
    return {
      id,
      email,
      nama,
      isVote,
      voteNumber,
      result1,
      result2,
    };
  }

  function generateId() {
    return +new Date();
  }

  function addVoteUser() {
    const email = document.getElementById("email").value;
    const nama = document.getElementById("name").value;
    const generateID = generateId();

    const userVote = generateUser(generateID, email, nama, false, 0, 0, 0);
    dataVoteUsers.push(userVote);
    console.log(dataVoteUsers);
  }

  function findVote(voteId) {
    for (const voteItem of dataVoteUsers) {
      if (voteItem.id == voteId) {
        return voteItem;
      }
    }
    return null;
  }

  function voteNumber1(voteId) {
    const voteTarget = findVote(voteId);

    if (voteTarget == null) {
      console.log("error");
      return;
    } else if (!voteTarget.isVote) {
      let resultTemp = 0;
      if (dataVoteUsers.length == 1) {
        voteTarget.result2 = 0;
        resultTemp = 0;
      } else {
        voteTarget.result2 = dataVoteUsers[dataVoteUsers.length - 2].result2;
        resultTemp = dataVoteUsers[dataVoteUsers.length - 2].result1;
      }
      voteTarget.voteNumber = 1;
      voteTarget.isVote = true;
      voteTarget.result1 = 1 + resultTemp;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      window.location.href = "index.html";
    }
  }

  function voteNumber2(voteId) {
    const voteTarget = findVote(voteId);

    if (voteTarget == null) {
      console.log("error");
      return;
    } else if (!voteTarget.isVote) {
      let resultTemp = 0;
      if (dataVoteUsers.length == 1) {
        voteTarget.result2 = 0;
        resultTemp = 0;
      } else {
        voteTarget.result1 = dataVoteUsers[dataVoteUsers.length - 2].result1;
        resultTemp = dataVoteUsers[dataVoteUsers.length - 2].result2;
      }
      voteTarget.voteNumber = 2;
      voteTarget.isVote = true;
      voteTarget.result2 = 1 + resultTemp;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      window.location.href = "index.html";
    }
  }

  function winner() {
    const elemenHasil = document.getElementById("pemenang");
    const gambarPemenang1 = document.getElementById("img-win-1");
    const gambarPemenang2 = document.getElementById("img-win-2");
    const count1 = document.getElementById("hasil-vote-1");
    const count2 = document.getElementById("hasil-vote-2");
    const wait1 = document.getElementById("wait-1");
    const wait2 = document.getElementById("wait-2");

    const data = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    let dataResult1 = 0;
    let dataResult2 = 0;

    if (data == undefined) {
      return;
    } else if (data.length == 1) {
      return;
    } else if (data[data.length - 1].isVote == false) {
      dataResult1 = data[data.length - 2].result1;
      dataResult2 = data[data.length - 2].result2;
    } else {
      dataResult1 = data[data.length - 1].result1;
      dataResult2 = data[data.length - 1].result2;
    }
    if (dataResult1 > dataResult2) {
      wait1.remove();
      wait2.remove();
      elemenHasil.innerText = "No 1";
      gambarPemenang1.src = "assets/img/ketua-hero-1.svg";
      gambarPemenang1.classList.add("vote-img-1");
      gambarPemenang2.src = "assets/img/ketua-hero-2.svg";
    } else if (dataResult1 < dataResult2) {
      wait1.remove();
      wait2.remove();
      elemenHasil.innerText = "No 2";
      gambarPemenang1.src = "assets/img/wakil-hero-1.svg";
      gambarPemenang1.classList.add("vote-img-2");
      gambarPemenang2.src = "assets/img/wakil-hero-2.svg";
    } else {
      elemenHasil.innerText = "-";
    }
    count1.innerText = dataResult1;
    count2.innerText = dataResult2;
  }

  function isStorageExist() /* boolean */ {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist()) {
      const userParsed = JSON.stringify(dataVoteUsers);
      localStorage.setItem(USER_STORAGE_KEY, userParsed);
      document.dispatchEvent(new Event(SAVED_USER));
    }
  }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(USER_STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const user of data) {
        dataVoteUsers.push(user);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
