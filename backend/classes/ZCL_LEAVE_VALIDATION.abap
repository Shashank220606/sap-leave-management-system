CLASS zcl_leave_validation DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.


CLASS zcl_leave_validation IMPLEMENTATION.

  METHOD if_oo_adt_classrun~main.

    DATA lv_emp_id       TYPE zlm_employee-emp_id.
    DATA lv_leave_type   TYPE zlm_leave_type-leave_type.
    DATA lv_from_date    TYPE d.
    DATA lv_to_date      TYPE d.
    DATA lv_no_of_days   TYPE i.
    DATA lv_balance      TYPE i.

    "Test insufficient balance
    lv_emp_id     = 'EMP001'.
    lv_leave_type = 'CL'.
    lv_from_date  = '20261010'.
    lv_to_date    = '20261024'.

    "Check employee
    SELECT SINGLE emp_id
      FROM zlm_employee
      WHERE emp_id = @lv_emp_id
      INTO @DATA(lv_employee).

    IF lv_employee IS INITIAL.

      out->write( 'ERROR: Employee does not exist.' ).
      RETURN.

    ENDIF.

    "Check dates
    IF lv_from_date > lv_to_date.

      out->write( 'ERROR: From date cannot be after To date.' ).
      RETURN.

    ENDIF.

    "Calculate number of days
    lv_no_of_days = lv_to_date - lv_from_date + 1.

    "Read employee leave balance
    SELECT SINGLE *
      FROM zlm_leave_bal
      WHERE emp_id = @lv_emp_id
      INTO @DATA(ls_balance).

    IF sy-subrc <> 0.

      out->write( 'ERROR: Leave balance not found.' ).
      RETURN.

    ENDIF.

    "Select balance according to leave type
    CASE lv_leave_type.

      WHEN 'CL'.

        lv_balance = ls_balance-cl_bal.

      WHEN 'SL'.

        lv_balance = ls_balance-sl_bal.

      WHEN 'EL'.

        lv_balance = ls_balance-el_bal.

      WHEN OTHERS.

        out->write( 'ERROR: Invalid leave type.' ).
        RETURN.

    ENDCASE.

    "Check available balance
    IF lv_balance < lv_no_of_days.

      out->write( 'ERROR: Insufficient leave balance.' ).
      out->write( |Available Balance: { lv_balance }| ).
      out->write( |Requested Days: { lv_no_of_days }| ).
      RETURN.

    ENDIF.

    out->write( 'Leave request validation successful.' ).

  ENDMETHOD.

ENDCLASS.