
/*
Steps:
(1) get the business unit of the user
(2) use the query below to retrieve:-
	- staff_id of the specifed business unit
	- trans_type: 01 or 02
	- trans_sum: summation of te product qty
	- customer count
(3) for each staff
	- (trans_sum with trans_type=01 - trans_sum with trans_type=02) / customer count = average basket size
(4) sum up each staff's average basket size and then divide by the staff count = busienss average
*/

SELECT
	eu.staff_id as staff_id,
	cs.TRANS_TYPE as trans_type,
	SUM(bop.PRODUCT_QTY) as trans_sum,
	COUNT(DISTINCT sc.CUSTOMER_VIP_NO) as customer_count
FROM CUSTOMER_SALES cs
JOIN STAFF_CUSTOMERS sc ON sc.CUSTOMER_VIP_NO = cs.VIP_NO
JOIN BASKET_ORDER_PRODUCTS bop ON cs.NEO_SKU_ID = bop.PRODUCT_SKU
JOIN ELLC_USERS eu on eu.staff_id = cs.STAFF_ID
JOIN ELLC_USER_PROFILES eup on eup.user_id = eu.ID
WHERE eup.business_unit = 'MW'
AND sc.CUSTOMER_TYPE = 'Core' /* this condition can be removed if querying all customers regardless of the customer type*/
AND cs.ORDER_DATE  >= '2022-01-01' 
AND cs.ORDER_DATE  <= '2023-01-01'
GROUP BY eu.staff_id, cs.TRANS_TYPE
