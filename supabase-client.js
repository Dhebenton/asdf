(() => {
    'use strict';

    const configured = () => {
        const config = window.ETR_SUPABASE_CONFIG || {};
        return Boolean(
            /^https:\/\/[^/]+\.supabase\.co\/?$/i.test(String(config.url || '').trim()) &&
            String(config.anonKey || '').trim()
        );
    };

    const insert = async (table, row) => {
        if (!configured()) {
            throw new Error('Supabase is not configured yet. Add the project URL and anon key in supabase-config.js.');
        }

        const config = window.ETR_SUPABASE_CONFIG;
        const baseURL = String(config.url).replace(/\/$/, '');
        const response = await fetch(`${baseURL}/rest/v1/${encodeURIComponent(table)}`, {
            method: 'POST',
            headers: {
                apikey: config.anonKey,
                Authorization: `Bearer ${config.anonKey}`,
                'Content-Type': 'application/json',
                Prefer: 'return=minimal'
            },
            body: JSON.stringify(row)
        });

        if (!response.ok) {
            let message = `Submission failed (${response.status}).`;
            try {
                const error = await response.json();
                message = error.message || error.hint || message;
            } catch {
                // Keep the HTTP error when Supabase does not return JSON.
            }
            throw new Error(message);
        }
    };

    window.ETRSupabase = Object.freeze({ configured, insert });
})();
