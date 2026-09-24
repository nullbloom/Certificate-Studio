const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    [...document.querySelectorAll(selector)];


/* ================= STORAGE ================= */

const STORAGE =
    "certificateStudioDataV1";

const DRAFT =
    "certificateStudioDraftV1";


/* ================= DEFAULT STATE ================= */

const defaults = {

    recipientName: "",

    achievement: "",

    organization: "",

    certificateDate:
        new Date()
            .toISOString()
            .slice(0, 10),

    certificateId:
        "CERT-2026-001",

    signatory: "",

    certificateTitle:
        "CERTIFICATE OF ACHIEVEMENT",

    certificateMessage:
        "This certificate is proudly presented in recognition of outstanding achievement and dedication.",

    template:
        "classic",

    accentColor:
        "#6d5dfc",

    textColor:
        "#172033",

    borderStyle:
        "double",

    logo:
        "",

    logoName:
        "",

    signature:
        "",

    signatureName:
        ""
};


let state = {
    ...defaults
};


/* ================= LOAD DATA ================= */

function loadData() {

    try {

        const draft =
            JSON.parse(
                localStorage.getItem(DRAFT)
                || "null"
            );

        if (draft) {

            state = {
                ...defaults,
                ...draft
            };

        }

    }

    catch (error) {

        console.log(
            "Could not load draft."
        );

    }

}


/* ================= CERTIFICATES ================= */

function certificates() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE)
            || "[]"
        );

    }

    catch (error) {

        return [];

    }

}


function saveCertificates(items) {

    localStorage.setItem(
        STORAGE,
        JSON.stringify(items)
    );

}


/* ================= FORM ================= */

function collectForm() {

    state.recipientName =
        $("#recipientName").value;

    state.achievement =
        $("#achievement").value;

    state.organization =
        $("#organization").value;

    state.certificateDate =
        $("#certificateDate").value;

    state.certificateId =
        $("#certificateId").value;

    state.signatory =
        $("#signatory").value;

    state.certificateTitle =
        $("#certificateTitle").value;

    state.certificateMessage =
        $("#certificateMessage").value;

    state.accentColor =
        $("#accentColor").value;

    state.textColor =
        $("#textColor").value;

    state.borderStyle =
        $("#borderStyle").value;

}


function setForm() {

    $("#recipientName").value =
        state.recipientName;

    $("#achievement").value =
        state.achievement;

    $("#organization").value =
        state.organization;

    $("#certificateDate").value =
        state.certificateDate;

    $("#certificateId").value =
        state.certificateId;

    $("#signatory").value =
        state.signatory;

    $("#certificateTitle").value =
        state.certificateTitle;

    $("#certificateMessage").value =
        state.certificateMessage;

    $("#accentColor").value =
        state.accentColor;

    $("#textColor").value =
        state.textColor;

    $("#borderStyle").value =
        state.borderStyle;


    $("#logoName").textContent =
        state.logoName
        || "No logo selected";

    $("#signatureName").textContent =
        state.signatureName
        || "No signature selected";

}


/* ================= DATE ================= */

function formattedDate(value) {

    if (!value) {

        return "24 September 2026";

    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(
        new Date(value + "T00:00:00")
    );

}


/* ================= PREVIEW ================= */

function updatePreview() {

    collectForm();


    const certificate =
        $("#certificate");


    certificate.className =
        "certificate " + state.template;


    certificate.style.setProperty(
        "--accent",
        state.accentColor
    );


    certificate.style.setProperty(
        "--cert-text",
        state.textColor
    );


    certificate.style.borderStyle =
        state.borderStyle === "none"
            ? "none"
            : state.borderStyle;


    certificate.style.borderColor =
        state.accentColor;


    $("#previewTitle").textContent =
        state.certificateTitle
        || "CERTIFICATE OF ACHIEVEMENT";


    $("#previewMessage").textContent =
        state.certificateMessage
        || "Certificate of achievement.";


    $("#previewRecipient").textContent =
        state.recipientName
        || "Your Name";


    $("#previewAchievement").textContent =
        state.achievement
        || "Outstanding Achievement";


    $("#previewOrganization").textContent =
        state.organization
        || "Your Organization";


    $("#previewSignatory").textContent =
        state.signatory
        || "Authorized Signatory";


    $("#previewDate").textContent =
        formattedDate(
            state.certificateDate
        );


    $("#previewId").textContent =
        state.certificateId
        || "CERT-2026-001";


    if (state.logo) {

        $("#certLogo").src =
            state.logo;

        $("#certLogo")
            .classList
            .remove("hidden");

    }

    else {

        $("#certLogo")
            .classList
            .add("hidden");

    }


    if (state.signature) {

        $("#certSignature").src =
            state.signature;

        $("#certSignature")
            .classList
            .remove("hidden");

    }

    else {

        $("#certSignature")
            .classList
            .add("hidden");

    }


    $$(".template-option")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.template
                === state.template
            );

        });

}


/* ================= TOAST ================= */

function showToast(message) {

    const toast =
        $("#toast");

    toast.textContent =
        message;

    toast.classList.add("show");


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);

}


/* ================= SAVE DRAFT ================= */

function saveDraft() {

    collectForm();

    localStorage.setItem(
        DRAFT,
        JSON.stringify(state)
    );

    showToast(
        "Draft saved successfully."
    );

}


/* ================= NAVIGATION ================= */

function showScreen(name) {

    const screens = [

        "dashboardScreen",

        "creatorScreen",

        "templatesScreen",

        "certificatesScreen",

        "settingsScreen",

        "helpScreen"

    ];


    screens.forEach(id => {

        $("#" + id)
            .classList
            .add("hidden");

    });


    $("#" + name)
        .classList
        .remove("hidden");


    $$(".nav-item")
        .forEach(item =>
            item.classList.remove("active")
        );


    const map = {

        dashboardScreen:
            "#dashboardNav",

        creatorScreen:
            "#createNav",

        templatesScreen:
            "#templatesNav",

        certificatesScreen:
            "#certificatesNav",

        settingsScreen:
            "#settingsNav",

        helpScreen:
            "#helpNav"

    };


    if (map[name]) {

        $(map[name])
            .classList
            .add("active");

    }


    if (
        name ===
        "dashboardScreen"
    ) {

        renderDashboard();

    }


    if (
        name ===
        "certificatesScreen"
    ) {

        renderCertificates();

    }

}


/* ================= OPEN CREATOR ================= */

function openCreator(template) {

    state.template =
        template
        || state.template
        || "classic";


    setForm();

    updatePreview();

    showScreen(
        "creatorScreen"
    );


    if (window.gsap) {

        gsap.from(
            ".editor-section",
            {
                y: 12,

                opacity: 0,

                duration: 0.35,

                stagger: 0.05
            }
        );

    }

}


/* ================= DASHBOARD ================= */

function renderDashboard() {

    const items =
        certificates();


    $("#totalCertificates")
        .textContent =
        items.length;


    $("#generatedCertificates")
        .textContent =
        items.length;


    $("#verifiedCertificates")
        .textContent =
        items.filter(
            item =>
                item.status ===
                "Verified"
        ).length;


    $("#totalTrend")
        .textContent =
        items.length
            ? "Saved locally"
            : "Create your first";


    const body =
        $("#recentBody");


    const empty =
        $("#emptyRecent");


    body.innerHTML = "";


    empty.style.display =
        items.length
            ? "none"
            : "block";


    items
        .slice(0, 6)
        .forEach((item, index) => {

            const row =
                document.createElement("tr");


            const letter =
                (
                    item.achievement
                    || "C"
                )
                    .charAt(0)
                    .toUpperCase();


            row.innerHTML = `

                <td>

                    <div class="certificate-name">

                        <div class="table-icon">
                            ${letter}
                        </div>

                        ${escapeHtml(
                            item.achievement
                            || "Certificate"
                        )}

                    </div>

                </td>


                <td>
                    ${escapeHtml(
                        item.recipientName
                        || "—"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        item.displayDate
                        ||
                        formattedDate(
                            item.certificateDate
                        )
                    )}
                </td>


                <td>

                    <span
                        class="status ${
                            item.status ===
                            "Verified"
                                ? "verified"
                                : "generated"
                        }">

                        ${item.status || "Generated"}

                    </span>

                </td>


                <td>

                    <button
                        class="row-open"
                        data-index="${index}"
                        style="
                            background:none;
                        ">

                        •••

                    </button>

                </td>

            `;


            body.appendChild(row);

        });


    $$(".row-open")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openSaved(
                        Number(
                            button.dataset.index
                        )
                    );

                }
            );

        });

}


/* ================= CERTIFICATE LIST ================= */

function renderCertificates() {

    const wrapper =
        $("#certificateCards");


    wrapper.innerHTML = "";


    const items =
        certificates();


    if (!items.length) {

        wrapper.innerHTML = `

            <div class="settings-card">

                <h3>
                    No certificates yet
                </h3>

                <p>
                    Generate a certificate
                    to see it here.
                </p>

            </div>

        `;

        return;

    }


    items.forEach(
        (item, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "certificate-card";


            card.innerHTML = `

                <h3>
                    ${escapeHtml(
                        item.achievement
                        || "Certificate"
                    )}
                </h3>

                <p>
                    <strong>
                        Recipient:
                    </strong>

                    ${escapeHtml(
                        item.recipientName
                        || "—"
                    )}

                </p>

                <p>
                    <strong>
                        Date:
                    </strong>

                    ${escapeHtml(
                        item.displayDate
                        ||
                        formattedDate(
                            item.certificateDate
                        )
                    )}

                </p>

                <p>
                    <strong>
                        ID:
                    </strong>

                    ${escapeHtml(
                        item.certificateId
                        || "—"
                    )}

                </p>

                <button
                    class="secondary-btn"
                    data-open="${index}">

                    Open

                </button>

            `;


            wrapper.appendChild(card);

        }
    );


    $$("[data-open]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openSaved(
                        Number(
                            button.dataset.open
                        )
                    );

                }
            );

        });

}


/* ================= OPEN SAVED ================= */

function openSaved(index) {

    const items =
        certificates();


    const item =
        items[index];


    if (!item) return;


    state = {

        ...defaults,

        ...item

    };


    setForm();

    updatePreview();

    showScreen(
        "creatorScreen"
    );


    showToast(
        "Certificate loaded."
    );

}


/* ================= ESCAPE HTML ================= */

function escapeHtml(value) {

    return String(value)
        .replace(
            /[&<>"']/g,
            character => {

                const map = {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    '"': "&quot;",

                    "'": "&#039;"

                };

                return map[
                    character
                ];

            }
        );

}


/* ================= IMAGE UPLOAD ================= */

function readImage(file, callback) {

    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        event => {

            callback(
                event.target.result
            );

        };


    reader.readAsDataURL(file);

}


/* ================= GENERATE ================= */

function generate() {

    collectForm();


    if (
        !state.recipientName.trim()
    ) {

        showToast(
            "Please enter a recipient name."
        );

        $("#recipientName")
            .focus();

        return;

    }


    const items =
        certificates();


    const record = {

        ...state,

        status:
            "Verified",

        displayDate:
            formattedDate(
                state.certificateDate
            ),

        createdAt:
            new Date().toISOString()

    };


    items.unshift(
        record
    );


    saveCertificates(
        items
    );


    localStorage.setItem(
        DRAFT,
        JSON.stringify(state)
    );


    renderDashboard();


    openPrintWindow(
        record
    );

}


/* ================= PRINT WINDOW ================= */

function openPrintWindow(data) {

    const logo =
        data.logo
            ? `
                <img
                    class="print-logo"
                    src="${data.logo}"
                    alt="">
              `
            : "";


    const signature =
        data.signature
            ? `
                <img
                    class="print-sign"
                    src="${data.signature}"
                    alt="">
              `
            : "";


    const template =
        data.template
        || "classic";


    const border =
        data.borderStyle === "none"
            ? "none"
            : data.borderStyle;


    const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
    ${escapeHtml(
        data.certificateId
    )}
</title>


<link
    href="
    https://fonts.googleapis.com/css2?
    family=Inter:wght@400;600;700&
    family=Playfair+Display:wght@500;600;700
    "
    rel="stylesheet">


<style>

@page {

    size: A4 landscape;

    margin: 0;

}


* {

    box-sizing: border-box;

}


body {

    margin: 0;

    font-family: Inter, Arial;

    background: white;

    color:
        ${data.textColor};

}


.certificate {

    width: 100vw;

    height: 100vh;

    position: relative;

    display: flex;

    flex-direction: column;

    align-items: center;

    text-align: center;

    padding: 10vh 8vw;

    background: #fbfaf5;

    overflow: hidden;

    border:
        7px
        ${border}
        ${data.accentColor};

}


.modern {

    background: #172033;

    color: white;

    align-items: flex-start;

    text-align: left;

    padding: 11vh 9vw;

}


.modern:before {

    content: "";

    position: absolute;

    width: 38vw;

    height: 38vw;

    border-radius: 50%;

    background:
        ${data.accentColor};

    right: -14vw;

    top: -14vw;

}


.elegant {

    background: #f5f0e9;

    border:
        1px solid
        ${data.accentColor};

    outline:
        1px solid
        ${data.accentColor};

    outline-offset: -2.5vh;

}


.print-logo {

    position: absolute;

    top: 5vh;

    left: 5vw;

    width: 70px;

    height: 70px;

    object-fit: contain;

}


.top {

    font-size: 1.2vw;

    letter-spacing: .45vw;

    font-weight: 700;

    color: #786e60;

}


.title {

    font-family:
        "Playfair Display",
        serif;

    font-size: 4vw;

    margin: 1vh 0;

}


.line {

    width: 7vw;

    height: 3px;

    background:
        ${data.accentColor};

    margin: 1.5vh auto;

}


.intro {

    font-size: 1vw;

    max-width: 55vw;

    line-height: 1.7;

    color: #777;

}


.recipient {

    font-family:
        "Playfair Display",
        serif;

    font-size: 4.2vw;

    margin: 2vh 0 1vh;

}


.achievement {

    font-size: 1.1vw;

    color: #777;

}


.achievement strong {

    color:
        ${data.accentColor};

}


.org {

    font-size: 1.1vw;

    font-weight: 600;

    margin-top: 1vh;

}


.bottom {

    display: flex;

    justify-content: space-between;

    width: 72%;

    margin-top: auto;

}


.sig,
.date {

    display: flex;

    flex-direction: column;

    align-items: center;

}


.print-sign {

    width: 10vw;

    height: 5vh;

    object-fit: contain;

}


.sigline {

    width: 13vw;

    border-top:
        1px solid #999;

}


.bottom strong {

    font-size: .9vw;

    margin-top: .5vh;

}


.bottom span {

    font-size: .7vw;

    color: #888;

}


.id {

    position: absolute;

    bottom: 2vh;

    font-size: .65vw;

    color: #999;

}


</style>

</head>


<body>


<div class="certificate ${template}">

    ${logo}


    <div class="top">
        CERTIFICATE
    </div>


    <div class="title">

        ${escapeHtml(
            data.certificateTitle
            || "CERTIFICATE OF ACHIEVEMENT"
        )}

    </div>


    <div class="line"></div>


    <div class="intro">

        ${escapeHtml(
            data.certificateMessage
            || ""
        )}

    </div>


    <div class="recipient">

        ${escapeHtml(
            data.recipientName
            || "Your Name"
        )}

    </div>


    <div class="achievement">

        For

        <strong>

            ${escapeHtml(
                data.achievement
                || "Outstanding Achievement"
            )}

        </strong>

    </div>


    <div class="org">

        ${escapeHtml(
            data.organization
            || "Your Organization"
        )}

    </div>


    <div class="bottom">


        <div class="sig">

            ${signature}

            <div class="sigline"></div>

            <strong>

                ${escapeHtml(
                    data.signatory
                    || "Authorized Signatory"
                )}

            </strong>

            <span>
                Signature
            </span>

        </div>


        <div class="date">

            <strong>

                ${escapeHtml(
                    formattedDate(
                        data.certificateDate
                    )
                )}

            </strong>

            <span>
                Date
            </span>

        </div>


    </div>


    <div class="id">

        ${escapeHtml(
            data.certificateId
            || "CERT-2026-001"
        )}

    </div>


</div>


<script>

window.onload = function() {

    setTimeout(
        () => window.print(),
        500
    );

};

<\/script>


</body>

</html>

`;


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=1200,height=850"
        );


    if (!printWindow) {

        showToast(
            "Please allow pop-ups to generate the certificate."
        );

        return;

    }


    printWindow.document.write(
        html
    );

    printWindow.document.close();

}


/* ================= NAVIGATION SETUP ================= */

function setupNavigation() {


    $("#dashboardNav").onclick =
        () =>
            showScreen(
                "dashboardScreen"
            );


    $("#createNav").onclick =
        () =>
            openCreator();


    $("#templatesNav").onclick =
        () =>
            showScreen(
                "templatesScreen"
            );


    $("#certificatesNav").onclick =
        () =>
            showScreen(
                "certificatesScreen"
            );


    $("#settingsNav").onclick =
        () =>
            showScreen(
                "settingsScreen"
            );


    $("#helpNav").onclick =
        () =>
            showScreen(
                "helpScreen"
            );


    $("#createButton").onclick =
        () =>
            openCreator(
                "classic"
            );


    $("#backButton").onclick =
        () =>
            showScreen(
                "dashboardScreen"
            );


    $("#viewTemplatesBtn").onclick =
        () =>
            showScreen(
                "templatesScreen"
            );


    $("#helpButton").onclick =
        () =>
            showScreen(
                "helpScreen"
            );


    $$("[data-dashboard]")
        .forEach(button => {

            button.onclick =
                () =>
                    showScreen(
                        "dashboardScreen"
                    );

        });


    $$(".template-card")
        .forEach(card => {

            card.onclick =
                () =>
                    openCreator(
                        card.dataset.template
                    );

        });

}


/* ================= FORM SETUP ================= */

function setupForm() {


    [

        "recipientName",

        "achievement",

        "organization",

        "certificateDate",

        "certificateId",

        "signatory",

        "certificateTitle",

        "certificateMessage",

        "accentColor",

        "textColor",

        "borderStyle"

    ].forEach(id => {

        $("#" + id)
            .addEventListener(
                "input",
                updatePreview
            );


        $("#" + id)
            .addEventListener(
                "change",
                updatePreview
            );

    });


    $$(".template-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.template =
                        button.dataset.template;

                    updatePreview();

                }
            );

        });


    $$(".upload-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    $(
                        "#" +
                        button.dataset.input
                    ).click();

                }
            );

        });


    $("#logoInput")
        .addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];

                readImage(
                    file,
                    source => {

                        state.logo =
                            source;

                        state.logoName =
                            file.name;

                        updatePreview();

                        setForm();

                    }
                );

            }
        );


    $("#signatureInput")
        .addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];

                readImage(
                    file,
                    source => {

                        state.signature =
                            source;

                        state.signatureName =
                            file.name;

                        updatePreview();

                        setForm();

                    }
                );

            }
        );


    $("#removeLogo").onclick =
        () => {

            state.logo = "";

            state.logoName = "";

            setForm();

            updatePreview();

        };


    $("#removeSignature").onclick =
        () => {

            state.signature = "";

            state.signatureName = "";

            setForm();

            updatePreview();

        };


    $("#saveButton").onclick =
        saveDraft;


    $("#generateButton").onclick =
        generate;


    $("#clearCertificatesBtn").onclick =
        () => {

            if (
                confirm(
                    "Delete all saved certificates from this browser?"
                )
            ) {

                saveCertificates([]);

                renderDashboard();

                showToast(
                    "Certificates cleared."
                );

            }

        };


    $("#resetApp").onclick =
        () => {

            if (
                confirm(
                    "Reset all Certificate Studio data?"
                )
            ) {

                localStorage.removeItem(
                    STORAGE
                );

                localStorage.removeItem(
                    DRAFT
                );


                state = {
                    ...defaults
                };


                setForm();

                updatePreview();

                renderDashboard();


                showToast(
                    "Application data reset."
                );

            }

        };


    $("#fullscreenPreview").onclick =
        () => {

            const stage =
                $("#certificateStage");


            if (
                stage.requestFullscreen
            ) {

                stage.requestFullscreen();

            }

        };

}


/* ================= TEMPLATE GALLERY ================= */

function populateGallery() {

    const gallery =
        $("#templateGallery");


    gallery.innerHTML =
        $$(".template-card")
            .map(card =>
                card.outerHTML
            )
            .join("");


    $$("#templateGallery .template-card")
        .forEach(card => {

            card.onclick =
                () =>
                    openCreator(
                        card.dataset.template
                    );

        });

}


/* ================= START APP ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadData();

        setupNavigation();

        setupForm();

        setForm();

        updatePreview();

        renderDashboard();

        populateGallery();


        if (window.gsap) {

            gsap.from(
                ".stat-card",
                {
                    y: 12,

                    opacity: 0,

                    duration: 0.45,

                    stagger: 0.06
                }
            );

        }

    }
);