from flask import Blueprint, request, jsonify, send_from_directory
from services.debt_service import DebtService
from services.income_service import IncomeService
from services.payment_service import PaymentService
from utils.file_utils import save_file, UPLOAD_FOLDER
from models.debt import Debt
from models.payment import Payment
from datetime import datetime

bp = Blueprint('finances', __name__, url_prefix='/finances')

class IncomeAPI:
    @staticmethod
    @bp.route('/income', methods=['POST'])
    def add_income():
        data = request.json
        try:
            income = IncomeService.create_income(data)
            return jsonify({"message": "Ingreso registrado exitosamente"}), 201
        except KeyError as e:
            return jsonify({"error": f"Falta el campo requerido: {str(e)}"}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @bp.route('/income/<int:id>', methods=['PUT'])
    def edit_income(id):
        data = request.json
        try:
            IncomeService.update_income(id, data)
            return jsonify({"message": "Ingreso actualizado exitosamente"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @bp.route('/income/<int:id>', methods=['DELETE'])
    def delete_income(id):
        try:
            IncomeService.delete_income(id)
            return jsonify({"message": "Ingreso eliminado exitosamente"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @bp.route('/income', methods=['GET'])
    def get_incomes():
        incomes = IncomeService.get_all_incomes()
        return jsonify([{
            "id": income.id,
            "amount": income.amount,
            "source": getattr(income, 'source', 'Ingreso Total'),
            "date": income.date.strftime('%Y-%m-%d')
        } for income in incomes]), 200

class DebtAPI:
    @staticmethod
    @bp.route('/debt', methods=['POST'])
    def add_debt():
        data = request.json
        try:
            DebtService.create_debt(data)
            return jsonify({"message": "Deuda registrada exitosamente"}), 201
        except KeyError as e:
            return jsonify({"error": f"Falta el campo requerido: {str(e)}"}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @bp.route('/debt', methods=['GET'])
    def get_debts():
        debts = DebtService.get_all_debts()
        result = []
        for d in debts:
            remaining_payments = 0
            if d.installment_amount and d.installment_amount > 0:
                remaining_payments = int(d.remaining_amount // d.installment_amount)
            result.append({
                "id": d.id,
                "name": d.name,
                "total_amount": d.total_amount,
                "remaining_amount": d.remaining_amount,
                "due_date": d.due_date.strftime('%Y-%m-%d'),
                "interest_rate": d.interest_rate,
                "num_installments": d.num_installments,
                "installment_amount": d.installment_amount,
                "payment_day": d.payment_day,
                "remaining_payments": remaining_payments
            })
        return jsonify(result)

    @staticmethod
    @bp.route('/debt/<int:id>', methods=['PUT'])
    def edit_debt(id):
        data = request.json
        try:
            DebtService.update_debt(id, data)
            return jsonify({"message": "Deuda actualizada exitosamente"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @bp.route('/debt/<int:id>', methods=['DELETE'])
    def delete_debt(id):
        try:
            DebtService.delete_debt(id)
            return jsonify({"message": "Deuda eliminada exitosamente"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

class PaymentAPI:
    @staticmethod
    @bp.route('/payment', methods=['POST'])
    def add_payment():
        amount = request.form.get('amount')
        debt_id = request.form.get('debt_id')
        file = request.files.get('file')
        date = request.form.get('date') or datetime.now().strftime('%Y-%m-%d')

        if not amount or not debt_id or not file:
            return jsonify({"error": "Faltan datos"}), 400

        filename = save_file(file)
        PaymentService.create_payment(amount, debt_id, filename, date)
        return jsonify({"message": "Pago registrado"}), 201

    @staticmethod
    @bp.route('/payment', methods=['GET'])
    def get_payments():
        payments = PaymentService.get_all_payments()
        result = []
        for p in payments:
            debt = Debt.query.get(p.debt_id)
            cuotas_restantes = 0
            restante = 0
            if debt and debt.installment_amount > 0:
                cuotas_restantes = int(debt.remaining_amount // debt.installment_amount)
                restante = debt.remaining_amount
            result.append({
                "id": p.id,
                "amount": p.amount,
                "date": p.date.strftime('%Y-%m-%d'),
                "debt_name": debt.name if debt else "",
                "remaining_installments": cuotas_restantes,
                "remaining_amount": restante,
                "receipt_url": f"/finances/receipt/{p.receipt_filename}" if p.receipt_filename else ""
            })
        return jsonify(result), 200

    @staticmethod
    @bp.route('/receipt/<filename>', methods=['GET'])
    def get_receipt(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)