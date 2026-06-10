// Check login session
(async () => {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location = "login.html";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        document.getElementById("detailsContainer").innerHTML = `
            <div class="detail-card">
                <h2>Record Not Found</h2>
                <p>No beneficiary ID provided.</p>

                <a href="records.html">
                    <button>Back to Records</button>
                </a>
            </div>
        `;
        return;
    }

    const { data, error } = await supabaseClient
        .from("beneficiaries")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {

        document.getElementById("detailsContainer").innerHTML = `
            <div class="detail-card">
                <h2>Record Not Found</h2>
                <p>Unable to load beneficiary information.</p>

                <a href="records.html">
                    <button>Back to Records</button>
                </a>
            </div>
        `;

        return;
    }

    const balance = Number(data.balance || 0);
    const interest = Number(data.interest || 0);
    const serviceFee = Number(data.service_fee || 0);
    const total = Number(data.total || 0);

    document.getElementById("detailsContainer").innerHTML = `

    <div class="detail-card">

        <h2>${data.name}</h2>

        <div class="section">

            <h3>Personal Information</h3>

            <p><strong>ID:</strong> ${data.id}</p>

            <p><strong>Address:</strong>
            ${data.address || 'N/A'}
            </p>

            <p><strong>Extension Worker:</strong>
            ${data.extension_worker || 'N/A'}
            </p>

        </div>

        <div class="section">

            <h3>Project Information</h3>

            <p><strong>Project:</strong>
            ${data.project || 'N/A'}
            </p>

            <p><strong>Year:</strong>
            ${data.year || 'N/A'}
            </p>

            <p><strong>Record No:</strong>
            ${data.record_no || 'N/A'}
            </p>

        </div>

        <div class="section">

            <h3>Financial Information</h3>

            <div class="finance-grid">

                <div class="finance-box">
                    <span>Balance</span>
                    <div class="amount">
                        ₱${balance.toLocaleString()}
                    </div>
                </div>

                <div class="finance-box">
                    <span>Interest</span>
                    <div class="amount">
                        ₱${interest.toLocaleString()}
                    </div>
                </div>

                <div class="finance-box">
                    <span>Service Fee</span>
                    <div class="amount">
                        ₱${serviceFee.toLocaleString()}
                    </div>
                </div>

                <div class="finance-box total-box">
                    <span>Total Amount</span>
                    <div class="amount">
                        ₱${total.toLocaleString()}
                    </div>
                </div>

            </div>

        </div>

        <div class="section">

            <h3>System Information</h3>

            <p>
                <strong>Created:</strong>
                ${data.created_at
                    ? new Date(data.created_at).toLocaleString()
                    : 'N/A'}
            </p>

            <p>
                <strong>Updated:</strong>
                ${data.updated_at
                    ? new Date(data.updated_at).toLocaleString()
                    : 'N/A'}
            </p>

        </div>

        <a href="records.html">
            <button>
                Back to Records
            </button>
        </a>

    </div>

    `;

})();
