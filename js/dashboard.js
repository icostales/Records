(async () => {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location = "login.html";
        return;
    }

    window.location = "records.html";

})();
