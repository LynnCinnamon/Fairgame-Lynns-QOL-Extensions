// ==UserScript==
// @name         Lynns Fair Game QoL Extension
// @namespace    https://fair.kaliburg.de/#
// @version      0.1.4
// @description  Fair Game QOL Enhancements
// @author       Lynn
// @match        https://fair.kaliburg.de/
// @include      *kaliburg.de*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?domain=kaliburg.de
// @grant        unsafeWindow
// @license      MIT
// ==/UserScript==

// Script made and maintained by Lynn#6969!

// Features include:
// - Scrollable, bigger chat
// - Chat mentions (with sound)
// - Ladder Switch
// - Chat switch
// - Time to next multi
// - Time to next bias
// - Top vinegar loss
// - Follow person


if (typeof unsafeWindow !== 'undefined') {
    window = unsafeWindow;
}

const sleep = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

(async () => {


    mentionSound = new Audio(
        'https://assets.mixkit.co/sfx/download/mixkit-software-interface-start-2574.wav'
    );

    ladderUnlockedSound = new Audio(
        'https://assets.mixkit.co/sfx/download/mixkit-magic-key-2840.wav'
    );

    ladderAscendedSound = new Audio(
        'https://assets.mixkit.co/sfx/download/mixkit-melodic-bonus-collect-1938.wav'
    );

    //Waiting for the base script to load
    while (true) {
        await sleep(100);
        try {
            if (addOption) {
                break;
            }
        } catch (e) {}
    }
    console.log("[FairGame] Initializing Lynn's QOL");

    //Options
    addNewSection("Lynn's Chad tweaks");
    addOption(CheckboxOption("Invert Chad", "invertChad"));
    addOption(CheckboxOption("Scrollable Chad", "scrollableChad"));
    addOption(TextInputOption("Saved Chad Message Count", "chadMessageCount", "# of chad messages, max 9999", "4"))
    chadMessageCount.value = 50;
    addOption(CheckboxOption("Enable group mentions", "enableGroupMentions"));
    addOption(CheckboxOption("Highlight Mentions", "highlightMentions", true));
    addOption(CheckboxOption("Mention Sound", "mentionSounds"));
    addOption(SliderOption("Mention Volume", "mentionVolume", 1, 100, 1, 100));
    subscribeToDomNode("mentionVolume", ()=>{
        mentionSound.volume = parseInt(mentionVolume.value)/100;
    });
    addOption(ButtonOption("Test Mention Sound", "testMentionSound"));
    $(testMentionSound).click(()=>{
        mentionSound.play();
    });

    addNewSection("Lynn's Ladder tweaks");
    addOption(CheckboxOption("Use Lynns Ladder Code", "useLynnsLadderCode"));
    addOption(CheckboxOption("Show User ID", "showUserIDInLadder"));
    addOption(CheckboxOption("Hide Promoted Users", "hidePromotedUsers"));
    addOption(CheckboxOption("Stick First Row To Top", "stickFirstRowToTop"));
    addOption(CheckboxOption("Ladder Unlocked Sound", "ladderUnlockedSound"));
    addOption(SliderOption("Ladder Unlocked Volume", "ladderUnlockedVolume", 1, 100, 1, 100));
    subscribeToDomNode("ladderUnlockedVolume", ()=>{
        ladderUnlockedSound.volume = parseInt(ladderUnlockedVolume.value)/100;
    });
    addOption(ButtonOption("Test Ladder Unlocked Sound", "testLadderUnlockedSound"));
    $(testLadderUnlockedSound).click(()=>{
        ladderUnlockedSound.play();
    });
    addOption(CheckboxOption("Ladder Ascended Sound", "ladderAscendedSound"));
    addOption(SliderOption("Ladder Ascended Volume", "ladderAscendedVolume", 1, 100, 1, 100));
    subscribeToDomNode("ladderAscendedVolume", ()=>{
        ladderAscendedSound.volume = parseInt(ladderAscendedVolume.value)/100;
    });
    addOption(ButtonOption("Test Ladder Ascended Sound", "testLadderAscendedSound"));
    $(testLadderAscendedSound).click(()=>{
        ladderAscendedSound.play();
    });

    addNewSection("Lynn's Mod Loader");
    var modLoaderContainer = TextInputOption("Add Script URL", "addScriptURLTextField", "URL", "", "addNewModScript()")
    addOption(modLoaderContainer);

    addNewSection("Lynn's Data tweaks");
    addOption(CheckboxOption("Save Data", "saveData"));
    addNewSection("Report Bugs");
    addOption(ButtonOption("Github", "reportBugGithub"));
    $(reportBugGithub).click(()=>{
        window.open("https://github.com/LynnCinnamon/Fairgame-Lynns-QOL-Extensions/issues/new");
    });

    window.addNewModScript = (url = "", enabled = false) => {
        //check if localStorage has a key called "modLoaderRiskAccepted" and if it is true
        if (!(localStorage.getItem("modLoaderRiskAccepted") == "true")) {
            //if it is not true, show the mod loader risk warning
            if(!confirm("This will load a script from an untrusted source.\n\nThis is not recommended unless you know what you are doing.\n\nClick OK to continue, or Cancel to stop loading the script.")){
                return;
            }
            //set localStorage key "modLoaderRiskAccepted" to true
            localStorage.setItem("modLoaderRiskAccepted", "true");
        }

        var modEntry = document.createElement("div");
        modEntry.className = "modEntry";
        modEntry.style.margin = "15px";
        modEntry.innerHTML = `
            <div class="modEntryTitle">
                <input type="text" class="modEntryTitleInput" placeholder="Script Name">
            </div>
            <div class="modEntryURL">
                <input type="text" class="modEntryURLInput" placeholder="Script URL"></input>
            </div>
            <div class="modEntryRemove" style="display: inline-block">
                <button class="btn btn-primary shadow-none" onclick="this.parentElement.parentElement.remove(); saveData()">Remove</button>
            </div>
            <div class="modEntrySave" style="display: inline-block">
                <button class="btn btn-primary shadow-none" onclick="saveData()">Save</button>
            </div>
            <div class="modEntrySave" style="display: inline-block">
                <input type="checkbox" class="modEntryEnabled" ${enabled?'checked':''}> Enabled</input>
            </div>
        `;
        $(modLoaderContainer).append(modEntry);
        modEntry.querySelector(".modEntryURLInput").value = addScriptURLTextField.value;
        modEntry.querySelector(".modEntryTitleInput").value = addScriptURLTextField.value.split("/").pop().split(".").shift();
        addScriptURLTextField.value = "";

        $(modEntry.querySelector(".modEntryURLInput")).change(()=>{
            modEntry.querySelector(".modEntryTitleInput").value = modEntry.querySelector(".modEntryURLInput").value.split("/").pop().split(".").shift();
        });

        //now load the script
        if(url && enabled)
        {
            loadAndRunScript(url);
        }
        else
        {
            if(enabled)
            {
                loadAndRunScript(modEntry.querySelector(".modEntryURLInput").value);
            }
            window.saveData();
        }
    };

    window.saveData = function() {
        //if we want to save data
        if ($("#saveData").prop("checked")) {
            var saveData = {
                mentionSound: $("#mentionSounds").prop("checked"),
                mentionHighlight: $("#highlightMentions").prop("checked"),
                saveData: $("#saveData").prop("checked"),
                invertChad: $("#invertChad").prop("checked"),
                scrollableChad: $("#scrollableChad").prop("checked"),
                chadMessageCount: $("#chadMessageCount").val(),
                useLynnsLadderCode: $("#useLynnsLadderCode").prop("checked"),
                showUserIDInLadder: $("#showUserIDInLadder").prop("checked"),
                stickFirstRowToTop: $("#stickFirstRowToTop").prop("checked"),
                ladderUnlockedSound: $("#ladderUnlockedSound").prop("checked"),
                ladderUnlockedVolume: $("#ladderUnlockedVolume").val(),
                ladderAscendedSound: $("#ladderAscendedSound").prop("checked"),
                ladderAscendedVolume: $("#ladderAscendedVolume").val(),
                mentionVolume: $("#mentionVolume").val(),
                enableGroupMentions: $("#enableGroupMentions").prop("checked"),
                hidePromotedUsers: $("#hidePromotedUsers").prop("checked"),

                //now save the mods as an array
                modList: (()=>{
                    var modList = [];
                    $(".modEntry").each((i, modEntry)=>{
                        modList.push({
                            name: modEntry.querySelector(".modEntryTitleInput").value,
                            url: modEntry.querySelector(".modEntryURLInput").value,
                            enabled: modEntry.querySelector(".modEntryEnabled").checked
                        });
                    });
                    return modList;
                })(),


                rowsInput: $("#rowsInput").val(),
                scrollableLadder: $("#scrollableLadder").prop("checked"),
                expandedLadder: $("#expandedLadder").prop("checked"),
                scrollablePage: $("#scrollablePage").prop("checked"),
                promotePoints: $("#promotePoints").prop("checked"),
            };
            localStorage.setItem("lynnsQOLData", JSON.stringify(saveData));
        }
    }

    //Load options
    if (localStorage.getItem("lynnsQOLData") != null) {
        window.lynnsQOLData = JSON.parse(localStorage.getItem("lynnsQOLData"));
        $("#saveData").prop("checked", lynnsQOLData.saveData);
        $("#mentionSounds").prop("checked", lynnsQOLData.mentionSound);
        $("#mentionVolume").val(lynnsQOLData.mentionVolume);
        $("#highlightMentions").prop("checked", lynnsQOLData.mentionHighlight);
        $("#invertChad").prop("checked", lynnsQOLData.invertChad);
        $("#scrollableChad").prop("checked", lynnsQOLData.scrollableChad);
        $("#chadMessageCount").val(lynnsQOLData.chadMessageCount);
        $("#useLynnsLadderCode").prop("checked", lynnsQOLData.useLynnsLadderCode);
        $("#showUserIDInLadder").prop("checked", lynnsQOLData.showUserIDInLadder);
        $("#stickFirstRowToTop").prop("checked", lynnsQOLData.stickFirstRowToTop);
        $("#ladderUnlockedSound").prop("checked", lynnsQOLData.ladderUnlockedSound);
        $("#ladderUnlockedVolume").val(lynnsQOLData.ladderUnlockedVolume);
        $("#ladderAscendedSound").prop("checked", lynnsQOLData.ladderAscendedSound);
        $("#ladderAscendedVolume").val(lynnsQOLData.ladderAscendedVolume);
        $("#enableGroupMentions").prop("checked", lynnsQOLData.enableGroupMentions);
        $("#hidePromotedUsers").prop("checked", lynnsQOLData.hidePromotedUsers);
        //load mods
        if (lynnsQOLData.modList != null) {
            for (var i = 0; i < lynnsQOLData.modList.length; i++) {
                addNewModScript(lynnsQOLData.modList[i].url, lynnsQOLData.modList[i].enabled);
                $(modLoaderContainer).find(".modEntry:last-child .modEntryURLInput").val(lynnsQOLData.modList[i].url);
                $(modLoaderContainer).find(".modEntry:last-child .modEntryTitleInput").val(lynnsQOLData.modList[i].name);
            }
        }

        mentionSound.volume = parseInt(mentionVolume.value)/100;
        ladderUnlockedSound.volume = parseInt(ladderUnlockedVolume.value)/100;
        ladderAscendedSound.volume = parseInt(ladderAscendedVolume.value)/100;

        $("#rowsInput").val(lynnsQOLData.rowsInput);
        $("#scrollableLadder").prop("checked", lynnsQOLData.scrollableLadder);
        $("#expandedLadder").prop("checked", lynnsQOLData.expandedLadder);
        $("#scrollablePage").prop("checked", lynnsQOLData.scrollablePage);
        $("#promotePoints").prop("checked", lynnsQOLData.promotePoints);

        expandLadder(lynnsQOLData.scrollableLadder);
        qolOptions.expandedLadder.size = parseInt(lynnsQOLData.rowsInput) > 10 ? parseInt(lynnsQOLData.rowsInput) : 10;
        clientData.ladderPadding = qolOptions.expandedLadder.size / 2;
    }



    subscribeToDomNode("invertChad", saveData);
    subscribeToDomNode("scrollableChad", saveData);
    subscribeToDomNode("mentionSounds", saveData);
    subscribeToDomNode("highlightMentions", saveData);
    subscribeToDomNode("saveData", saveData);
    subscribeToDomNode("useLynnsLadderCode", window.updateLadder);
    subscribeToDomNode("chadMessageCount", saveData);
    subscribeToDomNode("chadMessageCount", window.updateChad);
    subscribeToDomNode("useLynnsLadderCode", saveData);
    subscribeToDomNode("showUserIDInLadder", saveData);
    subscribeToDomNode("stickFirstRowToTop", saveData);
    subscribeToDomNode("enableGroupMentions", saveData);
    subscribeToDomNode("hidePromotedUsers", saveData);

    showOrHideGroupSub = ()=>{
        var subscribeButton = $("#mentionSubscribeButton")[0];
        var subscribeText = $("#mentionSubscribeTextInput")[0];
        var unsubButtons = $(".GroupNotificationUnsubscribe");
        if ($("#enableGroupMentions").prop("checked")) {
            subscribeText.style.display = "inline-block";
            subscribeButton.style.display = "inline-block";
            unsubButtons.css("display", "block");
        } else {
            subscribeText.style.display = "none";
            subscribeButton.style.display = "none";
            unsubButtons.css("display", "none");
        }
    };
    setTimeout(showOrHideGroupSub, 100);
    subscribeToDomNode("enableGroupMentions", showOrHideGroupSub);


    //Subscribing to the base scripts settings
    subscribeToDomNode("rowsInput", saveData);
    subscribeToDomNode("scrollableLadder", saveData);
    subscribeToDomNode("expandedLadder", saveData);
    subscribeToDomNode("scrollablePage", saveData);
    subscribeToDomNode("promotePoints", saveData);






    window.expandChat = function () {
        if($("#scrollableChad").prop("checked"))
        {
            var chatTable = $("#messagesBody").parent()
            var chatParent = chatTable.parent();
            var chatContainer = document.createElement("div");
            chatContainer.className = "chat-container";
            chatContainer.style.width = "100%";
            chatContainer.style.height = "64vh";
            chatContainer.style.overflow = "auto";
            chatContainer.style.border = "gray solid 2px";
            chatParent[0].replaceChild(chatContainer, chatTable[0]);
            chatContainer.appendChild(chatTable[0]);
        }
        else
        {
            if($(".chat-container")[0])
            {
                $(".chat-container")[0].outerHTML = $(".chat-container")[0].innerHTML;
            }
        }
    };

    window.unrestrictedLadderNavigation = localStorage.getItem("isModerator") === "true";
    window.displayLadderNavigation = function () {

        if(document.getElementById("prevLadder"))
        {
            document.getElementById("prevLadder").disabled = ladderData.currentLadder.number <= 1;
            document.getElementById("nextLadder").disabled = ladderData.currentLadder.number >= identityData.highestCurrentLadder && !window.unrestrictedLadderNavigation;
            document.getElementById("ladderNum").innerHTML = ` Ladder # ${ladderData.currentLadder.number} `
            return;
        }

        const nextLadder = () => {
            if (ladderData.currentLadder.number + 1 <= identityData.highestCurrentLadder || window.unrestrictedLadderNavigation) {
                changeLadder(ladderData.currentLadder.number + 1);
                setTimeout(() => {
                    displayLadderNavigation();
                }, 100);
            }
        }
        const prevLadder = () => {
            if (ladderData.currentLadder.number > 1) {
                changeLadder(ladderData.currentLadder.number - 1);
            }
            setTimeout(() => {
                displayLadderNavigation();
            }, 100);
        }

        const nextButton = document.createElement('button');
        nextButton.classList.add("btn", "btn-outline-secondary");
        nextButton.innerHTML = "&gt;";
        nextButton.id = "nextLadder";
        nextButton.onclick = nextLadder;

        const prevButton = document.createElement('button');
        prevButton.classList.add("btn", "btn-outline-secondary");
        prevButton.innerHTML = "&lt;";
        prevButton.id = "prevLadder";
        prevButton.onclick = prevLadder;

        if (ladderData.currentLadder.number <= 1) prevButton.disabled = true;
        if (ladderData.currentLadder.number >= identityData.highestCurrentLadder) nextButton.disabled = true;

        const ladderNum = document.createElement('span');
        ladderNum.id = "ladderNum";
        ladderNum.innerHTML = ` Ladder # ${ladderData.currentLadder.number} `;

        $('#ladderNumber').empty().append(prevButton).append(ladderNum).append(nextButton);
        document.getElementById("ladderNumber").id = "ladderNumberOld";
        var div = document.createElement('div');
        div.id = "ladderNumber";
        document.head.appendChild(div);
        div.style.display = "none";
    }

    window.unrestrictedChatNavigation = localStorage.getItem("isModerator") === "true";
    window.displayChatNavigation = function () {

        if(document.getElementById("prevChad"))
        {
            document.getElementById("prevChad").disabled = chatData.currentChatNumber <= 1;
            document.getElementById("nextChad").disabled = chatData.currentChatNumber >= identityData.highestCurrentLadder && !window.unrestrictedChatNavigation;
            document.getElementById("chatNum").innerHTML = ` Chad # ${chatData.currentChatNumber} `;
            return;
        }

        const nextChad = () => {
            if (chatData.currentChatNumber + 1 <= identityData.highestCurrentLadder || window.unrestrictedChatNavigation) {
                document.getElementsByClassName("chat-number")[0].innerHTML = " Chad # " + (chatData.currentChatNumber + 1) + " ";
                changeChatRoom(chatData.currentChatNumber + 1);
                updateChat();
            }
            setTimeout(() => {
            window.displayChatNavigation();
            }, 100);
        }
        const prevChad = () => {
            if (chatData.currentChatNumber > 1) {
                document.getElementsByClassName("chat-number")[0].innerHTML = " Chad # " + (chatData.currentChatNumber - 1) + " ";
                changeChatRoom(chatData.currentChatNumber - 1);
                updateChat();
            }
            setTimeout(() => {
            window.displayChatNavigation();
            }, 100);
        }

        const nextButton = document.createElement('button');
        nextButton.classList.add("btn", "btn-outline-secondary");
        nextButton.innerHTML = "&gt;";
        nextButton.id = "nextChad";
        nextButton.onclick = nextChad;

        const prevButton = document.createElement('button');
        prevButton.classList.add("btn", "btn-outline-secondary");
        prevButton.innerHTML = "&lt;";
        prevButton.id = "prevChad";
        prevButton.onclick = prevChad;

        if (chatData.currentChatNumber <= 1) prevButton.disabled = true;
        if (chatData.currentChatNumber >= identityData.highestCurrentLadder) nextButton.disabled = true;

        const chatNum = document.createElement('span');
        chatNum.classList.add("chat-number");
        chatNum.innerHTML = ` Chad # ${ladderData.currentLadder.number} `;
        chatNum.id = "chatNum";
        var container = document.createElement('div');
        var container2 = document.createElement('div');

        container.className = "row col-2 text-center";
        container.appendChild(container2);
        container2.className = "h5";
        container2.appendChild(prevButton);
        container2.appendChild(chatNum);
        container2.appendChild(nextButton);
        $('#helpLink')[0].parentElement.parentElement.insertBefore(container, $('#helpLink')[0].parentElement);
        rankerCount.parentElement.className = "col-1 text-start";
        helpLink.parentElement.className = "col-1 text-end";
    }
    window.handleChatUpdates = function (message) {
        if (message) {
            if (ladderData.yourRanker.username != "") {
                if (message.message.includes("@" + ladderData.yourRanker.username + '#' + ladderData.yourRanker.accountId) &&
                    $("#mentionSounds").is(":checked")) {
                    mentionSound.play();
                }
                if($("#enableGroupMentions").prop("checked"))
                {
                    window.subscribedMentions.forEach(mention => {
                        if (message.message.includes("@" + mention)) {
                            mentionSound.play();
                        }
                    });
                }
            }
            chatData.messages.unshift(message);
            var maxMessages = $("#chadMessageCount").val();
            if (!maxMessages > 10) maxMessages = 10;
            while (chatData.messages.length > maxMessages) chatData.messages.pop(); // <-- Change limit here
        }
        updateChat();
    };

    let oldShowButtons = showButtons;
    window.showButtons = function() {
        oldShowButtons();
        if(!ladderData.yourRanker.growing)
        {
            // Promote and Asshole Button Logic
            let promoteButton = $('#promoteButton');
            let assholeButton = $('#assholeButton');
            let ladderNumber = $('#ladderNumber');
            promoteButton.hide();
            ladderNumber.show();
            assholeButton.hide();
        }
    };

    window.recheckLadderUnlocked = function (ladderNum) {
        console.log("Rechecking Ladder Unlocked");
        window.ladderUnlocked = (ladderData.firstRanker.points.cmp(infoData.pointsForPromote.mul(ladderData.currentLadder.number)) >= 0 ||
                                ladderNum != identityData.highestCurrentLadder);
        if(ladderData.firstRanker.rank === 0)
        {
            window.ladderUnlocked = true;
            setTimeout(() => {
                recheckLadderUnlocked(ladderNum);
            }, 1);
        }
    }

    window.ladderUnlocked = true;
    let oldInitLadder = initLadder;
    window.initLadder = function(ladderNum) {
        oldInitLadder(ladderNum);
        window.ladderUnlocked = (ladderData.firstRanker.points.cmp(infoData.pointsForPromote.mul(ladderData.currentLadder.number)) >= 0 ||
                                ladderNum != identityData.highestCurrentLadder);
        if(ladderData.firstRanker.rank === 0)
        {
            window.ladderUnlocked = true;
            setTimeout(() => {
                recheckLadderUnlocked(ladderNum);
            }, 1);
        }
    }

    window.changeLadder = function(ladderNum) {
        if(ladderNum <= identityData.highestCurrentLadder || window.unrestrictedLadderNavigation)
        {
            if (ladderSubscription) ladderSubscription.unsubscribe();
            ladderSubscription = stompClient.subscribe('/topic/ladder/' + ladderNum,
            (message) => handleLadderUpdates(JSON.parse(message.body)), {uuid: getCookie("_uuid")});
            initLadder(ladderNum);
        }
    }

    //TODO: Check if this is still needed
    window.handlePromote = function(event) {
        ladderData.rankers.forEach(ranker => {
            if (event.accountId === ranker.accountId) {
                ranker.growing = false;
            }
        });

        if (event.accountId === identityData.accountId) {
            let newLadderNum = ladderData.currentLadder.number + 1;
            identityData.highestCurrentLadder = newLadderNum;
            changeLadder(newLadderNum);
            changeChatRoom(newLadderNum);
            if($("#ladderAscendedSound").is(":checked"))
            {
                ladderAscendedSound.play();
            }
        }
    }

    window.changeChatRoom = function(ladderNum) {
        if(ladderNum <= identityData.highestCurrentLadder || window.unrestrictedChatNavigation)
        {
            chatSubscription.unsubscribe();
            chatSubscription = stompClient.subscribe('/topic/chat/' + ladderNum,
                (message) => handleChatUpdates(JSON.parse(message.body)), {uuid: getCookie("_uuid")});
            initChat(ladderNum);
        }
    }

    window.mention = function(name)
    {
        name = name.text
        var messageBox = document.getElementById("messageInput");
        if(messageBox.value.length > 0)
        {
            messageBox.value = messageBox.value + " @" + name + " ";
        }
        else
        {
            messageBox.value = "@" + name + " ";
        }
        messageBox.focus();
    }

    let oldUpdateChat = window.updateChat;
    window.subscribedMentions = [];
    window.updateChat = function () {


        //go through the chat messages and check if they contain a mention of the user
        if (ladderData.yourRanker.username != "") {

            for (var i = 0; i < chatData.messages.length; i++) {
                if (chatData.messages[i].message.includes("@" + ladderData.yourRanker.username + '#' + ladderData.yourRanker.accountId) &&
                    $("#highlightMentions").is(":checked")) {
                    //if they do, and this message was not touched yet, highlight the mention
                    if (chatData.messages[i].highlighted == false || chatData.messages[i].highlighted == undefined) {

                        //make a copy of the message
                        chatData.messages[i].message1 = chatData.messages[i].message;

                        //replace all occurences of the mention with a highlighted version
                        chatData.messages[i].message = chatData.messages[i].message1.replaceAll("@" + ladderData.yourRanker.username + '#' + ladderData.yourRanker.accountId, "<a style=\"color: red\">@" + ladderData.yourRanker.username + '#' + ladderData.yourRanker.accountId + "</a>");
                        chatData.messages[i].highlighted = true;
                    }
                }
                if($("#enableGroupMentions").prop("checked"))
                {
                    window.subscribedMentions.forEach(mention => {
                        if (chatData.messages[i].message.includes("@" + mention) &&
                        $("#highlightMentions").is(":checked")) {
                            //if they do, and this message was not touched yet, highlight the mention
                            if (chatData.messages[i].highlighted == false || chatData.messages[i].highlighted == undefined) {

                                //make a copy of the message
                                if(chatData.messages[i].message1 == undefined)
                                {
                                    chatData.messages[i].message1 = chatData.messages[i].message;
                                }

                                //replace all occurences of the mention with a highlighted version
                                chatData.messages[i].message = chatData.messages[i].message1.replaceAll("@" + mention, "<a style=\"color: red\">@" + mention + "</a>");
                                chatData.messages[i].highlighted = true;
                            }
                        }
                    });
                }
                //if we have a #L<number> mention, create a link to the ladder
                //number can be any number
                if (chatData.messages[i].message.includes("#L") && !chatData.messages[i].message.includes("changeLadder")) {
                    var number = chatData.messages[i].message.split("#")[1].split(" ")[0].substring(1);
                    chatData.messages[i].message = chatData.messages[i].message.replaceAll("#L" + number, "<a style=\"cursor: pointer; color: blue\" onclick='changeLadder(" + number + ")'>#L" + number + "</a>");
                }

                //if we have a #C<number> mention, create a link to the chat
                //number can be any number
                if (chatData.messages[i].message.includes("#C") && !chatData.messages[i].message.includes("changeChatRoom")) {
                    var number = chatData.messages[i].message.split("#")[1].split(" ")[0].substring(1);
                    chatData.messages[i].message = chatData.messages[i].message.replaceAll("#C" + number, "<a style=\"cursor: pointer; color: blue\" onclick='changeChatRoom(" + number + ")'>#C" + number + "</a>");
                }

                //if the message was already highlighted, but the user no longer wishes to see it highlighted, then unhighlight it
                else if (chatData.messages[i].highlighted == true &&
                    !$("#highlightMentions").is(":checked")) {
                    chatData.messages[i].message = chatData.messages[i].message1;
                    chatData.messages[i].highlighted = false;
                }

                //check if the username has an onclick event
                if (!chatData.messages[i].username.includes("<a style=\"cursor: pointer;\" onclick='mention(this)'>")) {
                    //if it doesn't, add one
                    chatData.messages[i].username = `<a style=\"cursor: pointer;\" onclick='mention(this)'>${chatData.messages[i].username}#${chatData.messages[i].accountId}</a>`;
                }
            }
        }

        //copy the chat data
        var chatDataCopy = JSON.parse(JSON.stringify(chatData));
        if ($("#invertChad").is(":checked")) {
            //reverse the chat data, because we want to display the newest messages on the bottom
            chatData.messages.reverse();
        }
        //update the chat
        oldUpdateChat();
        //restore the chat data
        chatData = chatDataCopy;


        var chatContainer = document.getElementsByClassName("chat-container")[0];
        if(chatContainer)
        {
            if($("#invertChad").prop("checked"))
                chatContainer.scrollTop = chatContainer.scrollHeight + 1000;
            else
                chatContainer.scrollTop = 0;
        }
    }

    function newLine(element)
    {
        var newLine = document.createElement("br");
        element.appendChild(newLine);
    }

    function newValue(element, text, id)
    {
        var tt = document.createTextNode(text);
        var subText = document.createElement("span");
        subText.id = id;
        element.appendChild(tt);
        element.appendChild(subText);
    }

    function insertControls() {
        var controls = document.createElement("div");
        controls.id = "controls";
        var oldControls = document.querySelector(".col-7 > div:nth-child(2)").previousElementSibling;
        oldControls.parentNode.appendChild(controls);

        //insert new value display for time to next multi
        newValue(controls, "Time to next multi: ", "timeToNextMulti");
        newValue(controls, "      Time 'till even: ", "timeToMultiEven");

        //next line
        newLine(controls);

        //insert new value display for time to next bias
        newValue(controls, "Time to next bias: ", "timeToNextBias");
        newValue(controls, "      Time 'till even: ", "timeToBiasEven");
        newLine(controls);
        newValue(controls, "Top vinegar loss: ", "topVinegarLoss");
        newLine(controls);
        newValue(controls, "Highest Multi: ", "highestMulti");
        newLine(controls);
        newValue(controls, "Highest Bias: ", "highestBias");
        newLine(controls);
        newValue(controls, "Shortest #1 ETA: ", "shortestNr1ETA");

        //next line
        newLine(controls);


        //Toggle box for follow me on ladder
        var followMe = document.createElement("input");
        followMe.type = "checkbox";
        followMe.id = "followMe";
        followMe.checked = true;
        controls.appendChild(followMe);

        //label for follow me
        var followMeLabel = document.createElement("label");
        followMeLabel.htmlFor = "followMe";
        followMeLabel.innerHTML = "Follow me on ladder";
        followMeLabel.id = "followMeLabel";
        controls.appendChild(followMeLabel);


        var rightParent = document.querySelector("div.col");
        var textInput = document.createElement("input");
        textInput.type = "text";
        textInput.id = "mentionSubscribeTextInput";
        var subscribeButton = document.createElement("button");
        subscribeButton.id = "mentionSubscribeButton";
        subscribeButton.innerHTML = "Subscribe to mention";
        subscribeButton.className = "btn btn-primary";
        subscribeButton.style.height = "27px";
        subscribeButton.style.lineHeight = "0px";
        subscribeButton.style.marginTop = "-6px";
        subscribeButton.onclick = function () {
            var text = document.getElementById("mentionSubscribeTextInput").value;
            if (text.length > 0) {
                window.subscribedMentions.push(text);
                document.getElementById("mentionSubscribeTextInput").value = "";
                var unsub = ButtonOption("Unsubscribe from @" + text, "unsubscribeButton");

                unsub.classList.add("GroupNotificationUnsubscribe");
                rightParent.appendChild(unsub);
                unsubscribeButton.onclick = function () {
                    window.subscribedMentions.splice(window.subscribedMentions.indexOf(text), 1);
                    unsub.parentNode.removeChild(unsub);
                }
                var newLine = document.createElement("br");
                unsub.parentNode.appendChild(newLine);
            }
        };

        rightParent.appendChild(textInput);
        rightParent.appendChild(subscribeButton);

        textInput.style.display = "none";
        subscribeButton.style.display = "none";

        window.controlsInserted = true;
    }

    insertControls();
    window.idToFollow = -1;

    //..........Custom Row Colours
    let yourRankerCol = "#dea6de"     //You
    let promotedCol = "#a9a9a9"     //Promoted
    let youNeverCatchThemCol = "#ff8985"     //You Never Catch Them
    let youCanCatchThemCol = "#94f099"     //You Catch Them
    let theyCanCatchYouCol = "#fbc689"     //They Catch You
    let theyNeverCatchYouCol = "#9ce3e8"     //They Never Catch You

    window.originalWriteNewRow = window.writeNewRow;
    window.shortestETAToLadderEnd = 999999999;
    window.lynnsWriteNewRow = function(body, ranker) {

        if($("#hidePromotedUsers").is(":checked"))
        {
            if(!ranker.growing)
            {
                return;
            }
        }

        let row = body.insertRow();
        row.id = "ranker-" + ranker.accountId;
        const myAcc = getAcc(ladderData.yourRanker);
        const theirAcc = getAcc(ranker);
        const a = (theirAcc - myAcc) * 0.5;
        const b = (ranker.growing ? ranker.power : 0) - ladderData.yourRanker.power;
        const c = ranker.points - ladderData.yourRanker.points;

        let timeLeft = solveQuadratic(a, b, c);
        timeLeft = secondsToHms(timeLeft);

        if (timeLeft == '') {
            timeLeft = "Never";
        }

        const pointsToFirst = ladderData.firstRanker.points.sub(ranker.points);
        const firstPowerDifference = ranker.power - (ladderData.firstRanker.growing ? ladderData.firstRanker.power : 0);
        const pointsLeftPromote = infoData.pointsForPromote.mul(ladderData.currentLadder.number)
 - ranker.points;
        let timeToFirst = "";
        let currentETA = 0;
        if (ladderData.firstRanker.points.lessThan(infoData.pointsForPromote.mul(ladderData.currentLadder.number)
)) {
            // Time to reach minimum promotion points of the ladder
            currentETA = solveQuadratic(theirAcc/2, ranker.power, -pointsLeftPromote);
            timeToFirst = 'L' + secondsToHms(solveQuadratic(theirAcc/2, ranker.power, -pointsLeftPromote));
        } else {
            // time to reach first ranker
            currentETA = solveQuadratic(theirAcc/2, firstPowerDifference, -pointsToFirst)
            timeToFirst =  secondsToHms(solveQuadratic(theirAcc/2, firstPowerDifference, -pointsToFirst));
        }

        if (currentETA > 0 && !(!ranker.growing || (ranker.rank === 1 && ladderData.firstRanker.points.greaterThan(infoData.pointsForPromote.mul(ladderData.currentLadder.number)
        )))) {
            if (currentETA < window.shortestETAToLadderEnd) {
                window.shortestETAToLadderEnd = currentETA;
            }
        }

        if (!ranker.growing || (ranker.rank === 1 && ladderData.firstRanker.points.greaterThan(infoData.pointsForPromote.mul(ladderData.currentLadder.number)
))) timeToFirst = "";

        if (ladderData.yourRanker.rank == ranker.rank) {
            timeLeft = "";
        }

        let assholeTag = (ranker.timesAsshole < infoData.assholeTags.length) ?
            infoData.assholeTags[ranker.timesAsshole] : infoData.assholeTags[infoData.assholeTags.length - 1];
        let rank = (ranker.rank === 1 && !ranker.you && ranker.growing && ladderData.rankers.length >= Math.max(infoData.minimumPeopleForPromote, ladderData.currentLadder.number) &&
                    ladderData.firstRanker.points.cmp(infoData.pointsForPromote.mul(ladderData.currentLadder.number)
) >= 0 && ladderData.yourRanker.vinegar.cmp(getVinegarThrowCost()) >= 0) ?
            '<a href="#" style="text-decoration: none" onclick="throwVinegar(event)">🍇</a>' : ranker.rank;

        let multiPrice = ""
        if ((ranker.rank === 1 && ranker.growing) && qolOptions.multiLeader[$("#leadermultimode")[0].value]) {
            multiPrice = qolOptions.multiLeader[$("#leadermultimode")[0].value]
                .replace("NUMBER",`${numberFormatter.format(Math.pow(ladderData.currentLadder.number+1, ranker.multiplier+1))}`)
                .replace("STATUS", `${(ranker.power >= Math.pow(ladderData.currentLadder.number+1, ranker.multiplier+1)) ? "🟩" : "🟥"}`)
        }
        row.insertCell(0).innerHTML = rank + " " + assholeTag;
        row.insertCell(1).innerHTML = `[+${ranker.bias.toString().padStart(2,"0")} x${ranker.multiplier.toString().padStart(2,"0")}]`;
        var userIDSuper = `<sup style=" font-size: 0.95em ">#${ranker.accountId}</sup>`;
        if(!$("#showUserIDInLadder")[0].checked) {
            userIDSuper = "";
        }
        row.insertCell(2).innerHTML = `<a onclick="window.idToFollow = ${ranker.accountId}">${ranker.username}${userIDSuper}</a>`;
        row.cells[2].style.overflow = "hidden";
        row.insertCell(3).innerHTML = `${multiPrice} ${numberFormatter.format(ranker.power)} ${ranker.growing ? ranker.rank != 1 ? "(+" + numberFormatter.format((ranker.rank - 1 + ranker.bias) * ranker.multiplier) + ")" : "" : "(Promoted)"}`;
        row.cells[3].classList.add('text-end');
        row.insertCell(4).innerHTML = timeToFirst;
        row.cells[4].classList.add('text-end');
        row.insertCell(5).innerHTML = timeLeft;
        row.cells[5].classList.add('text-end');
        row.insertCell(6).innerHTML = `${numberFormatter.format(ranker.points)}`;
        row.cells[6].classList.add('text-end');

        if (ranker.you) {
            row.classList.add('table-active');
            row.style['background-color'] = yourRankerCol;
        } else if (!ranker.growing) {
            row.style['background-color'] = promotedCol;
        } else if ((ranker.rank < ladderData.yourRanker.rank && timeLeft == 'Never - ')) {
            row.style['background-color'] = youNeverCatchThemCol;
        } else if ((ranker.rank < ladderData.yourRanker.rank && timeLeft != 'Never - ')) {
            row.style['background-color'] = youCanCatchThemCol;
        } else if ((ranker.rank > ladderData.yourRanker.rank && timeLeft != 'Never - ')) {
            row.style['background-color'] = theyCanCatchYouCol;
        } else if ((ranker.rank > ladderData.yourRanker.rank && timeLeft == 'Never - ')) {
            row.style['background-color'] = theyNeverCatchYouCol;
        }
    }


    let oldUpdateLadder = updateLadder;
    window.updateLadder = ()=>{

        if($("#useLynnsLadderCode")[0].checked) {
            window.writeNewRow = window.lynnsWriteNewRow;
        }
        else {
            window.writeNewRow = window.originalWriteNewRow;
        }
        window.shortestETAToLadderEnd = 999999999;

        oldUpdateLadder();

        document.getElementById("shortestNr1ETA").innerHTML = (secondsToHms(window.shortestETAToLadderEnd));


        displayLadderNavigation();
        displayChatNavigation();

        infoText.style.height = "70px";

        if(window.idToFollow == -1 && ladderData.yourRanker.accountId > 0) {
            window.idToFollow = ladderData.yourRanker.accountId;
        }

        var myPoints = ladderData.yourRanker.points;
        var myPower = ladderData.yourRanker.power;

        if(window.lastPoints)
        {
            var change = myPoints - window.lastPoints;
            var changePower = myPower - window.lastPower;
            //round to 2 decimal places
            change = Math.round(change * 100) / 100;
            changePower = Math.round(changePower * 100) / 100;

            var costOfMulti = getUpgradeCost(ladderData.yourRanker.multiplier + 1);
            var costOfBias = getUpgradeCost(ladderData.yourRanker.bias + 1);

            var ticksToNextMulti = Math.ceil((costOfMulti - myPower) / changePower);
            var ticksToNextBias = Math.ceil((costOfBias - myPoints) / change);

            //clamp to 0
            ticksToNextMulti = Math.max(0, ticksToNextMulti);
            ticksToNextBias = Math.max(0, ticksToNextBias);

            var ticksToNextMultiString = secondsToHms(ticksToNextMulti);
            var ticksToNextBiasString = secondsToHms(ticksToNextBias);

            //Calculating the breaking even point
            let biasCost = getUpgradeCost(ladderData.yourRanker.bias + 1);
            let multiCost = getUpgradeCost(ladderData.yourRanker.multiplier + 1);
            const myAcc = getAcc(ladderData.yourRanker);
            let nextMultiTime = ladderData.yourRanker.power.lessThan(multiCost) ? (multiCost-ladderData.yourRanker.power)/myAcc : 0;

            let nextMultiPayback = 0;
            if (nextMultiTime > 0) {
                // If you don't have the required power calculate cost with future values
                const targetPoints = ladderData.yourRanker.points.add(ladderData.yourRanker.power.times(nextMultiTime)).add(myAcc * myAcc * nextMultiTime / 2);
                nextMultiPayback = solveQuadratic((ladderData.yourRanker.rank - 1 + ladderData.yourRanker.bias)/2, -multiCost, -targetPoints);
            } else {
                nextMultiPayback = solveQuadratic((ladderData.yourRanker.rank - 1 + ladderData.yourRanker.bias)/2, -ladderData.yourRanker.power, -ladderData.yourRanker.points);
            }
            nextMultiTime = secondsToHms(nextMultiTime);
            nextMultiPayback = secondsToHms(nextMultiPayback);

            let nextBiasTime = ladderData.yourRanker.points.lessThan(biasCost) ? solveQuadratic(myAcc/2, ladderData.yourRanker.power, -biasCost) : 0;
            // For bias payback you will need to solve accel_diff / 2 * t^2 - points = 0
            let nextBiasPayback = 0;
            if (nextBiasTime > 0) {
                // If you don't have the required points calculate cost with future value
                nextBiasPayback = solveQuadratic(ladderData.yourRanker.multiplier/2, 0, -biasCost);
            } else {
                nextBiasPayback = solveQuadratic(ladderData.yourRanker.multiplier/2, 0, -ladderData.yourRanker.points);
            }
            nextBiasTime = secondsToHms(nextBiasTime);
            nextBiasPayback = secondsToHms(nextBiasPayback);



            if(window.controlsInserted)
            {
                $("#timeToNextMulti")[0].innerHTML = ticksToNextMultiString;
                $("#timeToMultiEven")[0].innerHTML = nextMultiPayback;

                $("#timeToNextBias")[0].innerHTML = ticksToNextBiasString;
                $("#timeToBiasEven")[0].innerHTML = nextBiasPayback;

                //color the text
                {
                    if(ticksToNextMulti == 0)
                    {
                        $("#timeToNextMulti")[0].style.color = "green";
                    }
                    else if(ticksToNextMulti < 10)
                    {
                        $("#timeToNextMulti")[0].style.color = "orange";
                    }
                    else
                    {
                        $("#timeToNextMulti")[0].style.color = "red";
                    }
                    if(ticksToNextBias == 0)
                    {
                        $("#timeToNextBias")[0].style.color = "green";
                    }
                    else if(ticksToNextBias < 10)
                    {
                        $("#timeToNextBias")[0].style.color = "orange";
                    }
                    else
                    {
                        $("#timeToNextBias")[0].style.color = "red";
                    }
                }
                //check if we want to follow me on the ladder
                if($("#followMe")[0].checked && $(".ladder-container")[0])
                {
                    var followedRanker = $("#ranker-" + window.idToFollow)[0];
                    if(followedRanker)
                    {
                        //scroll ladder-container to your ranker minus half the height of the ladder-container
                        $(".ladder-container")[0].scrollTop = followedRanker.offsetTop - $(".ladder-container")[0].offsetHeight/2;
                    }
                }
                try{

                    $("#followMeLabel")[0].innerHTML = "Follow " + ladderData.rankers.find((ranker)=> {return ranker.accountId == window.idToFollow}).username + " (" + window.idToFollow + ")";
                }catch(e){
                    $("#followMeLabel")[0].innerHTML = "Follow " + window.idToFollow;
                }
            }
        }
        window.lastPoints = myPoints;
        window.lastPower = myPower;

        //Update stats for the top ranker
        let vinDecay = 0.9975;

        if(window.topRankerID != ladderData.rankers[0].accountId ||
            isNaN(window.topRankerTickCount) ||
            ladderData.firstRanker.points.cmp(infoData.pointsForPromote.mul(ladderData.currentLadder.number)) < 0 ||
            !ladderData.firstRanker.growing)
        {
            window.topRankerTickCount = -1;
            window.topRankerID = ladderData.rankers[0].accountId;
        }
        window.topRankerTickCount++;

        if(ladderData.currentLadder.number == 1 || true /** TODO: Remove the true in next round */)
        {

            let vinLoss = Math.pow(vinDecay, window.topRankerTickCount);
            $("#topVinegarLoss")[0].innerHTML = ((1-vinLoss) * 100).toFixed(2) + "%";
            //color the text red if the loss is 0% and green if it is 100% with a smooth transition
            var hue=((1-vinLoss)*100).toString(10);
            var color = ["hsl(",hue,",50%,50%)"].join("");
            $("#topVinegarLoss")[0].style.color = color;
        }
        else
        {
            $("#topVinegarLoss")[0].style.color = "black";
            $("#topVinegarLoss")[0].innerHTML = "No decay in ladder > 1";
        }


        if(!window.ladderUnlocked)
        {
            window.ladderUnlocked = ladderData.firstRanker.points.cmp(infoData.pointsForPromote.mul(ladderData.currentLadder.number)) >= 0;
            if(window.ladderUnlocked)
            {
                if($("#ladderUnlockedSound")[0].checked)
                {
                    ladderUnlockedSound.play();
                }
            }
        }

        //calculate the top bias and multi excluding your own
        let topBias = 0;
        let topMulti = 0;
        for(let i = 1; i < ladderData.rankers.length; i++)
        {
            if(ladderData.rankers[i].accountId == ladderData.yourRanker.accountId)
                continue;
            topBias = Math.max(topBias, ladderData.rankers[i].bias);
            topMulti = Math.max(topMulti, ladderData.rankers[i].multiplier);
        }

        $("#highestBias")[0].innerHTML = `${topBias.toFixed(0)} (Yours: ${ladderData.yourRanker.bias.toFixed(0)})`;
        $("#highestMulti")[0].innerHTML = `${topMulti.toFixed(0)} (Yours: ${ladderData.yourRanker.multiplier.toFixed(0)})`;

        //Make the header of the ladder stick to the top of the ladder-container
        if($(".ladder-container")[0])
        {
            var thead = $(".ladder-container")[0].getElementsByTagName("thead")[0];
            var firstRow = $(".ladder-container")[0].getElementsByTagName("tbody")[0].children[0];
            if(thead && firstRow)
            {
                thead.style.top = "0px";
                thead.style.position = "sticky";
                thead.style.zIndex = "2";
                thead.style.backgroundColor = "white";

                if($("#stickFirstRowToTop")[0].checked)
                {

                    firstRow.style.top = thead.offsetHeight + "px";
                    firstRow.style.position = "sticky";
                    firstRow.style.zIndex = "2";

                    //insert another row beneath the first row
                    var newRow = firstRow.cloneNode(true);
                    newRow.style.top = (thead.offsetHeight + firstRow.offsetHeight) + "px";
                    newRow.style.position = "sticky";
                    newRow.style.zIndex = "2";
                    newRow.style.height = "1px";
                    //make it all black
                    newRow.style.backgroundColor = "black";
                    //remove all children text nodes
                    for(let i = 0; i < newRow.children.length; i++)
                    {
                        newRow.children[i].innerHTML = "";
                    }
                    //insert it after the first row
                    $(".ladder-container")[0].getElementsByTagName("tbody")[0].insertBefore(newRow, firstRow.nextSibling);
                    //scroll the ladder-container 8px to the top
                    $(".ladder-container")[0].scrollTop -= newRow.offsetHeight;
                }
            }
        }

    };


    //wait until we know our username
    while (ladderData.yourRanker.username == "") {
        await sleep(100);
    }

    subscribeToDomNode("invertChad", updateChat);
    subscribeToDomNode("scrollableChad", expandChat);
    subscribeToDomNode("highlightMentions", updateChat);


    updateChat();
    expandChat();


    //remove all event listeners from $('#messageInput')[0]
    var el = document.getElementById("messageInput")
    elClone = el.cloneNode(true);

    el.parentNode.replaceChild(elClone, el);

    document.getElementById("messageInput").addEventListener("keydown", function(e) {
        //if the key is key up or down
        if(e.keyCode == 38 || e.keyCode == 40)
        {
            e.preventDefault();
            //if the mentionDropdown is open
            if(!$("#mentionDropdown")[0])
            {
                return;
            }

            //unhighlight all the options
            for(let i = 0; i < $("#mentionDropdown")[0].children.length; i++)
            {
                $("#mentionDropdown")[0].children[i].style.backgroundColor = "";
            }

            //increment or decrement dropdownElementSelected
            if(e.keyCode == 38)
            {
                window.dropdownElementSelected--;
            }
            else
            {
                window.dropdownElementSelected++;
            }

            //if the selected element is out of bounds
            if(window.dropdownElementSelected < 0)
            {
                window.dropdownElementSelected = $("#mentionDropdown")[0].children.length - 1;
            }
            else if(window.dropdownElementSelected >= $("#mentionDropdown")[0].children.length)
            {
                window.dropdownElementSelected = 0;
            }

            //scroll the selected element into view using the scrollTop property
            if(window.dropdownElementSelected > -1)
            {
                //if the selected element is not fully visible
                if($("#mentionDropdown")[0].children[window.dropdownElementSelected].offsetTop + $("#mentionDropdown")[0].children[window.dropdownElementSelected].offsetHeight > $("#mentionDropdown")[0].scrollTop + $("#mentionDropdown")[0].offsetHeight)
                {
                    $("#mentionDropdown")[0].scrollTop = $("#mentionDropdown")[0].children[window.dropdownElementSelected].offsetTop + $("#mentionDropdown")[0].children[window.dropdownElementSelected].offsetHeight - $("#mentionDropdown")[0].offsetHeight;
                }
                else if($("#mentionDropdown")[0].children[window.dropdownElementSelected].offsetTop < $("#mentionDropdown")[0].scrollTop)
                {
                    $("#mentionDropdown")[0].scrollTop = $("#mentionDropdown")[0].children[window.dropdownElementSelected].offsetTop;
                }
            }

            //highlight the selected element
            $("#mentionDropdown")[0].children[window.dropdownElementSelected].style.backgroundColor = "rgba(200,200,255,1)";

        }

        //if the key is enter
        if(e.keyCode == 13)
        {
            //if the mentionDropdown is open and we have a selection
            if($("#mentionDropdown")[0] && window.dropdownElementSelected != -1)
            {
                //click the selected element
                e.preventDefault();
                $("#mentionDropdown")[0].children[window.dropdownElementSelected].click();
                return;
            }
            else
            {
                sendMessage();
            }
        }
    });

    function htmlDecode(input){
        var e = document.createElement('textarea');
        e.innerHTML = input;
        // handle case of empty input
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
      }

    //implement better mentioning system
    document.getElementById("messageInput").addEventListener("keyup", function(e) {

        if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13)
        {
            e.preventDefault();
            return;
        }

        //if the key is escape
        if(e.keyCode == 27)
        {
            window.dropdownElementSelected = -1
        }

        //remove any existing dropdown
        var dropdown = document.getElementById("mentionDropdown");
        if(dropdown) { dropdown.remove(); }
        window.dropdownElementSelected = -1;

        var text = document.getElementById("messageInput").value;
        //find the last @ in the text
        var lastAt = text.lastIndexOf("@");
        //if there is no @, return
        if(lastAt == -1) { return; }
        //if there is a space after the @, return
        if(text.charAt(lastAt+1) == " ") { return; }

        //if the text after the @ is part of any username, display a dropdown with all the matching usernames
        var possibleMention = text.substring(lastAt+1);
        var possibleMentionLower = possibleMention.toLowerCase();
        var possibleMentions = [];
        for(let i = 0; i < ladderData.rankers.length; i++)
        {
            if((ladderData.rankers[i].username + '#' + ladderData.rankers[i].accountId).toLowerCase().startsWith(possibleMentionLower))
            {
                possibleMentions.push((ladderData.rankers[i].username + '#' + ladderData.rankers[i].accountId));
            }
        }


        window.possibleMention = possibleMentions;
        if(possibleMentions.length == 0) { return; }

        //sort the possible mentions alphabetically
        possibleMentions.sort();

        //create and display the dropdown
        var dropdown = document.createElement("div");
        dropdown.id = "mentionDropdown";
        dropdown.style.display = "block";
        dropdown.innerHTML = "";
        for(let i = 0; i < possibleMentions.length; i++)
        {
            var option = document.createElement("option");
            option.innerHTML = possibleMentions[i];

            option.style.border = "1px solid black";

            option.style.paddingRight = "5px";
            option.style.paddingLeft = "5px";

            option.addEventListener("click", function() {
                document.getElementById("messageInput").value = text.substring(0, lastAt) + '@' +  htmlDecode(possibleMentions[i]) + " ";
                dropdown.remove();
            });


            dropdown.appendChild(option);
        }
        //add the dropdown to the document
        var navbar = document.getElementsByClassName("fixed-bottom")[0];
        document.body.appendChild(dropdown);

        dropdown.style.bottom = navbar.offsetHeight + "px";
        dropdown.style.left = (95) + "px";
        dropdown.style.position = "absolute";
        dropdown.style.background = "white";
        dropdown.style.border = "1px solid black";
        dropdown.style.borderRadius = "5px";
        dropdown.style.zIndex = "1000";
        dropdown.style.padding = "5px";

        //limit the dropdown height to 300px
        if(dropdown.offsetHeight > 300)
        {
            dropdown.style.height = "300px";
            dropdown.style.overflowY = "scroll";
            //scroll to the bottom
            dropdown.scrollTop = dropdown.scrollHeight;
        }
    });

    function loadHTML(url)
    {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4)
                {
                    if(xhr.status == 200)
                    {
                        resolve(xhr.responseText);
                    }
                    else
                    {
                        reject(xhr.status);
                    }
                }
            }
            xhr.send();
        });
    }

    window.currentCode = await loadHTML("https://raw.githack.com/LynnCinnamon/Fairgame-Lynns-QOL-Extensions/master/Lynns%20Extension.js");
    async function checkForUpdate()
    {
        try{
            const latestCode = await loadHTML("https://raw.githack.com/LynnCinnamon/Fairgame-Lynns-QOL-Extensions/master/Lynns%20Extension.js");
            if(latestCode != currentCode)
            {
                var bo = ButtonOption("Update Script", "updateScript")
                //add bo as the second child to $("#offcanvasOptions")[0]
                $("#offcanvasOptions")[0].insertBefore(bo, $("#offcanvasOptions")[0].children[1]);
                $("#updateScript")[0].addEventListener("click", function() {
                    localStorage.setItem("autoLoadQOL", true);
                    window.location.reload();
                });
                //Color in the button so the user is made aware of it.
                document.querySelector("button.navbar-toggler:nth-child(4)").style.backgroundColor = "slateblue";
                document.querySelector("button.navbar-toggler:nth-child(4)").style.color = "whitesmoke";
            }
            else
            {
                setTimeout(checkForUpdate, 1000*60*5);
            }
        } catch(e)
        {
            setTimeout(checkForUpdate, 1000*60*1);
        }
    }
    checkForUpdate();

    if(window.lynnsMods == undefined)
    {
        window.lynnsMods = [
            "Base",
        ];
    }
})();