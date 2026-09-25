CLASS zcl_leave_approval DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.


CLASS zcl_leave_approval IMPLEMENTATION.

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

    IF ls_request-status <> 'PENDING'.
      out->write(
        |ERROR: Request { ls_request-request_id } is already { ls_request-status }.|
      ).
      RETURN.
    ENDIF.

    ls_request-status = 'APPROVED'.

    UPDATE zlm_leave_req
      FROM @ls_request.

    IF sy-subrc = 0.
      COMMIT WORK AND WAIT.
      out->write( 'Leave request approved successfully.' ).
      out->write( |Request ID: { ls_request-request_id }| ).
      out->write( |Employee ID: { ls_request-emp_id }| ).
      out->write( |Leave Type: { ls_request-leave_type }| ).
      out->write( |Status: { ls_request-status }| ).
    ELSE.
      out->write( 'ERROR: Could not approve leave request.' ).
    ENDIF.

  ENDMETHOD.

ENDCLASS.