/* 
steps:
(1) get the business unit of the staff
(2) get the data via the query below:-
	- staff_id
	- trans_type: 01 or 02
	- order_count
(3) for each staff:
	- (order_count with trans_type=01 - order_count with trans_type=02) = number of orders
(4) sum up the number of orders for each staff and divide it by the number of staff = business average
*/

SELECT
	eu.staff_id as staff_id,
	cs.TRANS_TYPE as trans_type,
	COUNT(DISTINCT cs.ORDER_NO) as order_count
FROM CUSTOMER_SALES cs 
JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
AND eup.business_unit = 'MW' /* get the business unit before making this query */
AND cs.ORDER_DATE  >= '2019-01-01' 
AND cs.ORDER_DATE  <= '2023-01-01'
GROUP BY eu.staff_id, cs.TRANS_TYPE

/* clientele */

SELECT
	eu.staff_id as staff_id,
	cs.TRANS_TYPE as trans_type,
	COUNT(DISTINCT cs.ORDER_NO) as order_count
FROM CUSTOMER_SALES cs
JOIN STAFF_CUSTOMERS sc ON cs.VIP_NO = sc.CUSTOMER_VIP_NO
JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
AND eup.business_unit = 'MW' /* get the business unit before making this query */
AND cs.ORDER_DATE  >= '2019-01-01' 
AND cs.ORDER_DATE  <= '2023-01-01'
GROUP BY eu.staff_id, cs.TRANS_TYPE


/* nonclientele = all - clientele */
