async function frontendEndpoint(context) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>League Roaster</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css">
    <script src="https://unpkg.com/htmx.org@2.0.3"></script>
    <script src="https://unpkg.com/htmx-ext-json-enc@2.0.1/json-enc.js"></script>
</head>
<body>
    <main>
        <h1 style="text-align: center;">🔥 League roaster</h1>
        <p style="text-align: center;">Get your League of Legends gameplay roasted by AI!</p>
        
        <div id="content">
            <div id="form-container">
                <form hx-post="/roast" hx-target="#content" hx-ext="json-enc">
                    <fieldset>
                        <label>
                            Summoner name & tag
                            <input type="text" name="tag" placeholder="e.g. blue saturday #fever" required>
                        </label>
                        <label>
                            Region
                            <select name="region" required>
                                <option value="">Select your region</option>
                                <optgroup label="Americas">
                                    <option value="na">North America</option>
                                    <option value="br">Brazil</option>
                                    <option value="lan">Latin America North</option>
                                    <option value="las">Latin America South</option>
                                </optgroup>
                                <optgroup label="Europe">
                                    <option value="euw">Europe West</option>
                                    <option value="eune">Europe Nordic & East</option>
                                    <option value="tr">Turkey</option>
                                    <option value="ru">Russia</option>
                                </optgroup>
                                <optgroup label="Asia">
                                    <option value="kr">Korea</option>
                                    <option value="jp">Japan</option>
                                </optgroup>
                                <optgroup label="Oceania">
                                    <option value="oce">Oceania</option>
                                </optgroup>
                            </select>
                        </label>
                        <label>
                            Language
                            <select name="language">
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                                <option value="pt">Português</option>
                            </select>
                        </label>
                    </fieldset>
                    <button type="submit" hx-disable-elt="this">🔥 Roast Me!</button>
                </form>
            </div>
        </div>
    </main>

    <script>
        document.body.addEventListener('htmx:beforeRequest', function(evt) {
            evt.target.innerHTML = '<p><strong>🔥 Analyzing your gameplay...</strong></p><p><em>This might take a moment while our AI reviews your League performance</em></p>';
        });
        
        document.body.addEventListener('htmx:afterRequest', function(evt) {
            if (evt.detail.successful) {
                const response = JSON.parse(evt.detail.xhr.responseText);
                if (response.error) {
                    evt.target.innerHTML = '<p style="color: red;">❌ ' + response.error + '</p>';
                } else {
                    evt.target.innerHTML = 
                        '<div><h3>🔥 ' + response.player + '</h3>' +
                        '<p>' + response.roast + '</p>' +
                        '<button onclick="location.reload()">🎯 Roast Another Player</button></div>';
                }
            }
        });
        
        document.body.addEventListener('htmx:responseError', function(evt) {
            evt.target.innerHTML = '<p style="color: red;">❌ Failed to roast! Try again.</p>';
        });
    </script>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export default frontendEndpoint
