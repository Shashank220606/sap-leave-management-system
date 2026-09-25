CLASS zcl_leave_report DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.


CLASS zcl_leave_report IMPLEMENTATION.

  METHOD if_oo_adt_classrun~main.

    SELECT *
      FROM zlm_leave_req
      ORDER BY request_id
      INTO TABLE @DATA(lt_requests).

    IF lt_requests IS INITIAL.
      out->write( 'No leave requests found.' ).
      RETURN.
    ENDIF.

    out->write( '========================================' ).
    out->write( '        SAP LEAVE HISTORY REPORT' ).
    out->write( '========================================' ).
    out->write( '' ).

    LOOP AT lt_requests INTO DATA(ls_request).

      out->write( |Request ID      : { ls_request-request_id }| ).
      out->write( |Employee ID     : { ls_request-emp_id }| ).
      out->write( |Leave Type      : { ls_request-leave_type }| ).
      out->write( |From Date       : { ls_request-from_date }| ).
      out->write( |To Date         : { ls_request-to_date }| ).
      out->write( |Number of Days  : { ls_request-no_of_days }| ).
      out->write( |Reason          : { ls_request-reason }| ).
      out->write( |Status          : { ls_request-status }| ).
      out->write( |Manager ID      : { ls_request-manager_id }| ).

      IF ls_request-balance_updated = 'X'.
        out->write( 'Balance Updated : YES' ).
      ELSE.
        out->write( 'Balance Updated : NO' ).
      ENDIF.

      out->write( '----------------------------------------' ).

    ENDLOOP.

  ENDMETHOD.

ENDCLASS.