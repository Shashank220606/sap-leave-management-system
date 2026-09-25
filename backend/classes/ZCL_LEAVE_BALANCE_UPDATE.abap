CLASS zcl_leave_balance_update DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.


CLASS zcl_leave_balance_update IMPLEMENTATION.

  METHOD if_oo_adt_classrun~main.

    DATA lv_request_id TYPE zlm_leave_req-request_id.

    lv_request_id = 'REQ003'.

    SELECT SINGLE *
      FROM zlm_leave_req
      WHERE request_id = @lv_request_id
      INTO @DATA(ls_request).

    IF sy-subrc <> 0.
      out->write( 'ERROR: Leave request not found.' ).
      RETURN.
    ENDIF.

    IF ls_request-status <> 'APPROVED'.
      out->write(
        |ERROR: Request is { ls_request-status }. Only APPROVED requests can update balance.|
      ).
      RETURN.
    ENDIF.

    IF ls_request-balance_updated = 'X'.
      out->write(
        |ERROR: Balance has already been updated for { ls_request-request_id }.|
      ).
      RETURN.
    ENDIF.

    SELECT SINGLE *
      FROM zlm_leave_bal
      WHERE emp_id = @ls_request-emp_id
      INTO @DATA(ls_balance).

    IF sy-subrc <> 0.
      out->write( 'ERROR: Employee leave balance not found.' ).
      RETURN.
    ENDIF.

    CASE ls_request-leave_type.

      WHEN 'CL'.
        IF ls_balance-cl_bal >= ls_request-no_of_days.
          ls_balance-cl_bal =
            ls_balance-cl_bal - ls_request-no_of_days.
        ELSE.
          out->write( 'ERROR: Insufficient Casual Leave balance.' ).
          RETURN.
        ENDIF.

      WHEN 'SL'.
        IF ls_balance-sl_bal >= ls_request-no_of_days.
          ls_balance-sl_bal =
            ls_balance-sl_bal - ls_request-no_of_days.
        ELSE.
          out->write( 'ERROR: Insufficient Sick Leave balance.' ).
          RETURN.
        ENDIF.

      WHEN 'EL'.
        IF ls_balance-el_bal >= ls_request-no_of_days.
          ls_balance-el_bal =
            ls_balance-el_bal - ls_request-no_of_days.
        ELSE.
          out->write( 'ERROR: Insufficient Earned Leave balance.' ).
          RETURN.
        ENDIF.

      WHEN OTHERS.
        out->write( 'ERROR: Invalid leave type.' ).
        RETURN.

    ENDCASE.

    UPDATE zlm_leave_bal
      FROM @ls_balance.

    IF sy-subrc <> 0.
      out->write( 'ERROR: Could not update leave balance.' ).
      RETURN.
    ENDIF.

    ls_request-balance_updated = 'X'.

    UPDATE zlm_leave_req
      FROM @ls_request.

    IF sy-subrc <> 0.
      out->write( 'ERROR: Could not update request status.' ).
      RETURN.
    ENDIF.

    COMMIT WORK AND WAIT.

    out->write( 'Leave balance updated successfully.' ).
    out->write( |Request ID: { ls_request-request_id }| ).
    out->write( |Employee ID: { ls_request-emp_id }| ).
    out->write( |Leave Type: { ls_request-leave_type }| ).
    out->write( |Days Used: { ls_request-no_of_days }| ).
    out->write( 'Balance Updated: X' ).

    CASE ls_request-leave_type.

      WHEN 'CL'.
        out->write( |Remaining CL Balance: { ls_balance-cl_bal }| ).

      WHEN 'SL'.
        out->write( |Remaining SL Balance: { ls_balance-sl_bal }| ).

      WHEN 'EL'.
        out->write( |Remaining EL Balance: { ls_balance-el_bal }| ).

    ENDCASE.

  ENDMETHOD.

ENDCLASS.