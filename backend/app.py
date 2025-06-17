from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import csv
import datetime

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345",
    database="inventario_db"
)

@app.route('/api/stock', methods=['GET'])
def get_stock():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM stock")
    stock = cursor.fetchall()
    cursor.close()
    return jsonify(stock)

@app.route('/api/stock', methods=['POST'])
def add_stock():
    data = request.get_json()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO stock (product, quantity, last_updated) VALUES (%s, %s, %s)",
        (data['product'], data['quantity'], datetime.datetime.now())
    )
    db.commit()
    cursor.close()
    return jsonify({'message': 'Stock actualizado'})

@app.route('/api/export_stock', methods=['GET'])
def export_stock():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM stock")
    stock = cursor.fetchall()
    with open('stock.csv', 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=['product', 'quantity', 'last_updated'])
        writer.writeheader()
        writer.writerows(stock)
    cursor.close()
    return jsonify({'message': 'Stock exportado a CSV'})

if __name__ == '__main__':
    app.run(debug=True)