from flask import Flask, jsonify, request
import sqlite3

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
            nome TEXT
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
    cursor.execute("INSERT INTO {} (latitudine, longitudine,nome) VALUES (?, ?,?)".format(NODE_TABLE), (52.005,-0.09,"GW" ))
    cursor.execute("INSERT INTO {} (latitudine, longitudine,nome) VALUES (?, ?,?)".format(NODE_TABLE), (52.105,1.09,"ST" ))
    cursor.execute("INSERT INTO {} (latitudine, longitudine,nome) VALUES (?, ?,?)".format(NODE_TABLE), (52.505,4,"SAT" ))

    # Inserimento di dati spot
    cursor.execute("INSERT INTO {} (latitudine, longitudine,radius,satName,project,name) VALUES (?, ?,?,?,?,?)".format(SPOT_TABLE), (52.505,4,400000,"SAT","slice1","Spot0" ))

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








if __name__ == '__main__':
    app.run(debug=True,port=3006)