const STORAGE_KEY = "invoiceflow-draft";


const itemsContainer =
  document.querySelector("#items-container");


const subtotalElement =
  document.querySelector("#subtotal");


const taxElement =
  document.querySelector("#tax");


const discountElement =
  document.querySelector("#discount");


const taxTotalElement =
  document.querySelector("#tax-total");


const discountTotalElement =
  document.querySelector("#discount-total");


const grandTotalElement =
  document.querySelector("#grand-total");


const invoiceNumberInput =
  document.querySelector("#invoice-number");


const saveStatus =
  document.querySelector("#save-status");



function formatCurrency(number) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD"
    }
  ).format(number);

}



function getToday() {

  return new Date()
    .toISOString()
    .split("T")[0];

}



function getFutureDate(days) {

  const date =
    new Date();

  date.setDate(
    date.getDate() + days
  );

  return date
    .toISOString()
    .split("T")[0];

}



function setDefaultDates() {

  document.querySelector(
    "#invoice-date"
  ).value =
    getToday();


  document.querySelector(
    "#due-date"
  ).value =
    getFutureDate(14);

}



function createItem(
  description = "",
  quantity = 1,
  rate = 0
) {

  const row =
    document.createElement("div");


  row.className =
    "item-row";


  row.innerHTML = `

    <input
      class="item-description"
      type="text"
      placeholder="Website design"
      value="${description}"
    >

    <input
      class="item-quantity"
      type="number"
      min="0"
      step="1"
      value="${quantity}"
    >

    <input
      class="item-rate"
      type="number"
      min="0"
      step="0.01"
      value="${rate}"
    >

    <div class="item-amount">
      $0.00
    </div>

    <button
      class="remove-item"
      title="Remove item"
    >
      ×
    </button>

  `;


  itemsContainer.appendChild(row);


  const inputs =
    row.querySelectorAll("input");


  inputs.forEach(
    input => {

      input.addEventListener(
        "input",
        function() {

          calculateTotals();

          saveDraft();

        }
      );

    }
  );


  row
    .querySelector(".remove-item")
    .addEventListener(
      "click",
      function() {

        row.remove();

        calculateTotals();

        saveDraft();

      }
    );


  calculateTotals();

}



function calculateTotals() {

  const rows =
    document.querySelectorAll(
      ".item-row"
    );


  let subtotal = 0;


  rows.forEach(
    row => {

      const quantity =
        Number(
          row.querySelector(
            ".item-quantity"
          ).value
        ) || 0;


      const rate =
        Number(
          row.querySelector(
            ".item-rate"
          ).value
        ) || 0;


      const amount =
        quantity * rate;


      row.querySelector(
        ".item-amount"
      ).textContent =
        formatCurrency(amount);


      subtotal += amount;

    }
  );


  const taxPercent =
    Number(
      taxElement.value
    ) || 0;


  const discountPercent =
    Number(
      discountElement.value
    ) || 0;


  const tax =
    subtotal *
    (taxPercent / 100);


  const discount =
    subtotal *
    (discountPercent / 100);


  const grandTotal =
    subtotal +
    tax -
    discount;


  subtotalElement.textContent =
    formatCurrency(subtotal);


  taxTotalElement.textContent =
    formatCurrency(tax);


  discountTotalElement.textContent =
    "-" + formatCurrency(discount);


  grandTotalElement.textContent =
    formatCurrency(
      Math.max(grandTotal, 0)
    );

}



function getItemData() {

  return Array.from(
    document.querySelectorAll(
      ".item-row"
    )
  ).map(
    row => ({

      description:
        row.querySelector(
          ".item-description"
        ).value,

      quantity:
        row.querySelector(
          ".item-quantity"
        ).value,

      rate:
        row.querySelector(
          ".item-rate"
        ).value

    })
  );

}



function saveDraft() {

  const draft = {

    documentType:
      document.querySelector(
        "#document-type"
      ).value,

    invoiceNumber:
      document.querySelector(
        "#invoice-number"
      ).value,

    invoiceDate:
      document.querySelector(
        "#invoice-date"
      ).value,

    dueDate:
      document.querySelector(
        "#due-date"
      ).value,


    businessName:
      document.querySelector(
        "#business-name"
      ).value,

    businessEmail:
      document.querySelector(
        "#business-email"
      ).value,

    businessPhone:
      document.querySelector(
        "#business-phone"
      ).value,

    businessAddress:
      document.querySelector(
        "#business-address"
      ).value,


    clientName:
      document.querySelector(
        "#client-name"
      ).value,

    clientCompany:
      document.querySelector(
        "#client-company"
      ).value,

    clientEmail:
      document.querySelector(
        "#client-email"
      ).value,

    clientAddress:
      document.querySelector(
        "#client-address"
      ).value,


    notes:
      document.querySelector(
        "#notes"
      ).value,

    terms:
      document.querySelector(
        "#terms"
      ).value,


    tax:
      taxElement.value,

    discount:
      discountElement.value,


    items:
      getItemData()

  };


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(draft)
  );


  saveStatus.textContent =
    "Draft saved";


  saveStatus.style.color =
    "#4bd18b";

}



function loadDraft() {

  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (!saved) {

    setDefaultDates();

    createItem(
      "Website Design",
      1,
      500
    );

    return;

  }


  const draft =
    JSON.parse(saved);


  document.querySelector(
    "#document-type"
  ).value =
    draft.documentType || "Invoice";


  document.querySelector(
    "#invoice-number"
  ).value =
    draft.invoiceNumber || "INV-1001";


  document.querySelector(
    "#invoice-date"
  ).value =
    draft.invoiceDate || getToday();


  document.querySelector(
    "#due-date"
  ).value =
    draft.dueDate || getFutureDate(14);



  document.querySelector(
    "#business-name"
  ).value =
    draft.businessName || "";


  document.querySelector(
    "#business-email"
  ).value =
    draft.businessEmail || "";


  document.querySelector(
    "#business-phone"
  ).value =
    draft.businessPhone || "";


  document.querySelector(
    "#business-address"
  ).value =
    draft.businessAddress || "";



  document.querySelector(
    "#client-name"
  ).value =
    draft.clientName || "";


  document.querySelector(
    "#client-company"
  ).value =
    draft.clientCompany || "";


  document.querySelector(
    "#client-email"
  ).value =
    draft.clientEmail || "";


  document.querySelector(
    "#client-address"
  ).value =
    draft.clientAddress || "";



  document.querySelector(
    "#notes"
  ).value =
    draft.notes || "";


  document.querySelector(
    "#terms"
  ).value =
    draft.terms || "";


  taxElement.value =
    draft.tax || 0;


  discountElement.value =
    draft.discount || 0;


  itemsContainer.innerHTML = "";


  if (
    draft.items &&
    draft.items.length
  ) {

    draft.items.forEach(
      item => {

        createItem(
          item.description,
          item.quantity,
          item.rate
        );

      }
    );

  } else {

    createItem();

  }


  calculateTotals();

}



function resetInvoice() {

  const confirmed =
    confirm(
      "Start a new invoice? This will clear the current draft."
    );


  if (!confirmed) return;


  localStorage.removeItem(
    STORAGE_KEY
  );


  location.reload();

}



document
  .querySelector("#add-item")
  .addEventListener(
    "click",
    function() {

      createItem();

      saveDraft();

    }
  );



taxElement.addEventListener(
  "input",
  function() {

    calculateTotals();

    saveDraft();

  }
);



discountElement.addEventListener(
  "input",
  function() {

    calculateTotals();

    saveDraft();

  }
);



document
  .querySelector("#print-invoice")
  .addEventListener(
    "click",
    function() {

      window.print();

    }
  );



document
  .querySelector("#reset-invoice")
  .addEventListener(
    "click",
    resetInvoice
  );



document
  .querySelectorAll(
    "input, textarea, select"
  )
  .forEach(
    element => {

      element.addEventListener(
        "input",
        function() {

          document.querySelector(
            "#footer-document-number"
          ).textContent =
            invoiceNumberInput.value;


          saveDraft();

        }
      );

    }
  );



invoiceNumberInput.addEventListener(
  "input",
  function() {

    document.querySelector(
      "#footer-document-number"
    ).textContent =
      invoiceNumberInput.value;

  }
);



loadDraft();

calculateTotals();


document.querySelector(
  "#footer-document-number"
).textContent =
  invoiceNumberInput.value;