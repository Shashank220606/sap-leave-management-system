CLASS zcl_leave_sample_data DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.


CLASS zcl_leave_sample_data IMPLEMENTATION.

  METHOD if_oo_adt_classrun~main.

    DATA lt_employee   TYPE TABLE OF zlm_employee.
    DATA lt_leave_type TYPE TABLE OF zlm_leave_type.
    DATA lt_leave_bal  TYPE TABLE OF zlm_leave_bal.

    lt_employee = VALUE #(
      ( client = sy-mandt
        emp_id = 'EMP001'
        emp_name = 'Rahul Kumar'
        department = 'IT'
        designation = 'Software Engineer'
        email = 'rahul@example.com'
        join_date = '20240115' )

      ( client = sy-mandt
        emp_id = 'EMP002'
        emp_name = 'Priya Sharma'
        department = 'HR'
        designation = 'HR Executive'
        email = 'priya@example.com'
        join_date = '20240210' )
    ).

    MODIFY zlm_employee FROM TABLE @lt_employee.

    lt_leave_type = VALUE #(
      ( client = sy-mandt
        leave_type = 'CL'
        leave_name = 'Casual Leave'
        allowed_days = 12 )

      ( client = sy-mandt
        leave_type = 'SL'
        leave_name = 'Sick Leave'
        allowed_days = 10 )

      ( client = sy-mandt
        leave_type = 'EL'
        leave_name = 'Earned Leave'
        allowed_days = 15 )
    ).

    MODIFY zlm_leave_type FROM TABLE @lt_leave_type.

    lt_leave_bal = VALUE #(
      ( client = sy-mandt
        emp_id = 'EMP001'
        cl_bal = 12
        sl_bal = 10
        el_bal = 15 )

      ( client = sy-mandt
        emp_id = 'EMP002'
        cl_bal = 8
        sl_bal = 7
        el_bal = 12 )
    ).

    MODIFY zlm_leave_bal FROM TABLE @lt_leave_bal.

    COMMIT WORK AND WAIT.

    out->write( 'Sample data inserted successfully.' ).

  ENDMETHOD.

ENDCLASS.