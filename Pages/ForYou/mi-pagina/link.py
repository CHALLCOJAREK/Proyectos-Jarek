from flask import Flask, redirect, request, jsonify

app = Flask(__name__)

# Diccionario en memoria para guardar las URL personalizadas
url_map = {}

@app.route('/crear', methods=['POST'])
def crear_redireccion():
    data = request.get_json()
    slug = data.get('slug')  # nombre personalizado
    destino = data.get('url')  # URL original

    if slug in url_map:
        return jsonify({'error': 'Ese nombre ya existe.'}), 400

    url_map[slug] = destino
    return jsonify({'mensaje': 'URL creada con éxito.', 'slug': slug})

@app.route('/<slug>')
def redireccionar(slug):
    if slug in url_map:
        return redirect(url_map[slug])
    else:
        return "Enlace no encontrado.", 404

if __name__ == '__main__':
    app.run(debug=True)
