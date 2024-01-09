from flask import Flask, jsonify, request
import sqlite3
import math
import json
from geopy.distance import geodesic


app = Flask(__name__)
NODE_TABLE = "node"
SPOT_TABLE = "Spot"

@app.route('/geometry', methods=['GET'])
def inizialize():
    # Connessione al database (crea il database se non esiste)
    conn = sqlite3.connect('geometry.db')

    # Creazione di un cursore
    cursor = conn.cursor()

    # Creazione di una tabella (se non esiste già)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS {} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitudine FLOAT,
            longitudine FLOAT,
            type TEXT,
            nome TEXT,
            ip TEXT
        )
    '''.format(NODE_TABLE))

    # Creazione di una tabella (se non esiste già)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS {} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitudine FLOAT,
            longitudine FLOAT,
            radius FLOAT,
            satName TEXT,
            project TEXT,
            name TEXT
        )
    '''.format(SPOT_TABLE))

    # Inserimento di dati node
    cursor.execute("INSERT INTO {} (latitudine, longitudine,type,nome) VALUES (?, ?,?,?)".format(NODE_TABLE), (52.005,-0.09,"Gateway","GW" ))
    cursor.execute("INSERT INTO {} (latitudine, longitudine,type,nome) VALUES (?, ?,?,?)".format(NODE_TABLE), (52.105,9.09,"Terminal","ST" ))
    cursor.execute("INSERT INTO {} (latitudine, longitudine,type,nome) VALUES (?, ?,?,?)".format(NODE_TABLE), (52.505,4,"Satellite","SAT" ))

    # Inserimento di dati spot
    cursor.execute("INSERT INTO {} (latitudine, longitudine,radius,satName,project,name) VALUES (?, ?,?,?,?,?)".format(SPOT_TABLE), (52.505,4,400000,"SAT-slice1","slice1","Spot0" ))

    conn.commit()
    conn.close()

    # Lettura dei dati
    conn = sqlite3.connect('geometry.db')
    cursor = conn.cursor()

    # Esecuzione di una query
    cursor.execute("SELECT * FROM {}".format(NODE_TABLE))
    node = cursor.fetchall()

    cursor.execute("SELECT * FROM {}".format(SPOT_TABLE))
    spot = cursor.fetchall()


    # Chiusura della connessione
    conn.close()

    return jsonify({'node': node,"spot":spot})

@app.route('/geometry/nodes', methods=['GET'])
def get_nodes():

    conn = sqlite3.connect('geometry.db')
    cursor = conn.cursor()

    # Esecuzione di una query
    cursor.execute("SELECT * FROM {}".format(NODE_TABLE))
    column_names = [column[0] for column in cursor.description]
    rows = cursor.fetchall()

    # Crea una lista di dizionari con il nome delle colonne come chiavi
    results = []
    for row in rows:
        result_dict = dict(zip(column_names, row))
        results.append(result_dict)

    # Chiusura della connessione
    conn.close()

    return jsonify({'nodes': results})

@app.route('/geometry/WS/<ground>', methods=['GET'])
def get_ws(ground):

    conn = sqlite3.connect('geometry.db')
    cursor = conn.cursor()

    # Esecuzione di una query
    cursor.execute("SELECT * FROM {} WHERE nome LIKE '%WS%' AND nome LIKE ?".format(NODE_TABLE), ('%{}%'.format(ground),))
    column_names = [column[0] for column in cursor.description]
    rows = cursor.fetchall()

    # Crea una lista di dizionari con il nome delle colonne come chiavi
    results = []
    for row in rows:
        result_dict = dict(zip(column_names, row))
        results.append(result_dict)

    # Chiusura della connessione
    conn.close()

    return jsonify({'nodes': results})

@app.route('/geometry/nodes/<project>/spots/<nameSpot>', methods=['GET'])
def get_nodes_inside_spot(project,nameSpot):
    conn = sqlite3.connect('geometry.db')
    cursor = conn.cursor()

    # Esecuzione di una query
    cursor.execute("SELECT * FROM {} WHERE project = ? AND name= ?".format(SPOT_TABLE),(project,nameSpot, ))
    column_names = [column[0] for column in cursor.description]
    rows = cursor.fetchall()

    # Crea una lista di dizionari con il nome delle colonne come chiavi
    results = []
    for row in rows:
        result_dict = dict(zip(column_names, row))
        results.append(result_dict)
    
    # Chiusura della connessione
    conn.close()
    
    spot=results[0]
    nodes = get_nodes().get_data()
    nodes = json.loads(nodes)
    
    result=[]
    for node in nodes["nodes"]:
        distance = geodesic((spot["latitudine"], spot["longitudine"]), (node["latitudine"], node["longitudine"])).meters
        if distance <= spot["radius"] and node["type"]!="Satellite":
            result.append(node)
   

    return jsonify({"nodes":result})
   
@app.route('/geometry/spots/<project>', methods=['GET'])
def get_spots(project):

    conn = sqlite3.connect('geometry.db')
    cursor = conn.cursor()

    # Esecuzione di una query
    cursor.execute("SELECT * FROM {} WHERE project = ?".format(SPOT_TABLE),(project,))
    column_names = [column[0] for column in cursor.description]
    rows = cursor.fetchall()

    # Crea una lista di dizionari con il nome delle colonne come chiavi
    results = []
    for row in rows:
        result_dict = dict(zip(column_names, row))
        results.append(result_dict)
    
    # Chiusura della connessione
    conn.close()

    return jsonify({'spots': results})

@app.route('/geometry/spots/<project>/sat/<satellite>', methods=['GET'])
def get_spots_sat(project,satellite):

    conn = sqlite3.connect('geometry.db')
    cursor = conn.cursor()

    # Esecuzione di una query
    cursor.execute("SELECT * FROM {} WHERE project = ? AND satName = ?".format(SPOT_TABLE),(project,satellite,))
    column_names = [column[0] for column in cursor.description]
    rows = cursor.fetchall()

    # Crea una lista di dizionari con il nome delle colonne come chiavi
    results = []
    for row in rows:
        result_dict = dict(zip(column_names, row))
        results.append(result_dict)
    
    # Chiusura della connessione
    conn.close()

    return jsonify({'spots': results})



@app.route('/geometry/nodes', methods=['POST'])
def post_node():
    conn = sqlite3.connect('geometry.db')
    cursor = conn.cursor()

    req = request.get_json()
    name = req.get('name')
    latitudine = req.get('latitudine')
    longitudine = req.get('longitudine')
    typeEntity = req.get('type')
    ip = req.get('ip')

    
    cursor.execute("INSERT INTO {} (latitudine, longitudine,type,nome,ip) VALUES (?, ?,?,?,?)".format(NODE_TABLE), (latitudine,longitudine,typeEntity,name,ip ))
    conn.commit()
    conn.close()

    return jsonify()


@app.route('/geometry/spots', methods=['POST'])
def post_spot():
    conn = sqlite3.connect('geometry.db')
    cursor = conn.cursor()

    req = request.get_json()
    project = req.get('project')
    latitudine = req.get('latitudine')
    longitudine = req.get('longitudine')
    radius = req.get('radius')
    satName = req.get('satName')
    name = req.get('name')

    cursor.execute("INSERT INTO {} (latitudine, longitudine,radius,satName,project,name) VALUES (?, ?,?,?,?,?)".format(SPOT_TABLE), (latitudine,longitudine,radius,satName,project,name ))

    newSpot = {
        "project": project,
        "latitudine": latitudine,
        "longitudine": longitudine,
        "radius": radius,
        "satName": satName,
        "name": name,
        "id":  cursor.lastrowid      
    }

    conn.commit()
    conn.close()

    return jsonify(newSpot)

@app.route('/geometry/spots/<id>', methods=['DELETE'])
def delete_spot(id):
    conn = sqlite3.connect('geometry.db')
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM {} WHERE id = ?".format(SPOT_TABLE), (id,))
    conn.commit()
    conn.close()

    return jsonify()

@app.route('/geometry/test/', methods=['GET'])
def is_point_inside_circle():
    from geopy.distance import geodesic
    
    radius = 400000

    # Coordinate del punto 1
    lat1, lon1 = (52, 4)

    # Coordinate del punto 2
    lat2, lon2 = (52, 9)

    # Calcolo della distanza
    distance = geodesic((lat1, lon1), (lat2, lon2)).meters

    print(distance <= radius)
    return jsonify()


if __name__ == '__main__':
    app.run(debug=True,port=3006)