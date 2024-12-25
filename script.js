document.addEventListener("DOMContentLoaded", function () {
    // Add row functionality
    const addRowButton = document.getElementById('add-row');
    const detailsTableBody = document.querySelector('#details-table tbody');
    
    addRowButton.addEventListener('click', () => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" class="description"></td>
            <td><input type="number" class="quantity" min="0"></td>
            <td><input type="number" class="unit-price" min="0" step="0.01"></td>
            <td><input type="number" class="cost" readonly></td>
            <td><button type="button" class="remove-row">Remove</button></td>
        `;
        detailsTableBody.appendChild(newRow);

        // Add event listener to the new remove button
        const removeButton = newRow.querySelector('.remove-row');
        removeButton.addEventListener('click', () => {
            detailsTableBody.removeChild(newRow);
            updateTotalCost();
        });

        // Add event listeners to the inputs for calculating cost
        newRow.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', updateTotalCost);
        });
    });

    // Calculate total cost function
    function updateTotalCost() {
        let totalCost = 0;
        const rows = document.querySelectorAll('#details-table tbody tr');
        rows.forEach(row => {
            const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
            const unitPrice = parseFloat(row.querySelector('.unit-price').value) || 0;
            const costInput = row.querySelector('.cost');
            const cost = quantity * unitPrice;
            costInput.value = cost.toFixed(2);
            totalCost += cost;
        });

        // Add tax
        const taxPercentage = parseFloat(document.getElementById('tax-percentage').value) || 0;
        const taxAmount = (totalCost * taxPercentage) / 100;
        totalCost += taxAmount;

        // Display total cost
        document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`;
    }

    // Update total cost when tax percentage is changed
    document.getElementById('tax-percentage').addEventListener('input', updateTotalCost);

    // Save as PDF
    const savePdfButton = document.getElementById('save-pdf');
    savePdfButton.addEventListener('click', () => {
        const doc = new jsPDF();
        doc.html(document.querySelector('main'), {
            callback: function (doc) {
                doc.save('project-form.pdf');
            },
            margin: [20, 20, 20, 20]
        });
    });

    // Print form
    const printButton = document.getElementById('print-form');
    printButton.addEventListener('click', () => {
        window.print();
    });
});
