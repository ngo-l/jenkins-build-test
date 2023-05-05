/* 
steps to 
(1) get the business unit
(2) query output:
	- staff_id
	- trans_type
	- product_quantity
	- order_count
(3) for each staff_id, 
	- (product_quantity with trans_type=01 - product_quantity with trans_type=02) / order_count (trans_type 01 + 02) = average basket size for each staff
(4) pick the one that matches the current staff id for individual metrics
(5) to retreive the business average, one needs to sum up the average basket size of each staff and then divide it by the number of staff
*/

SELECT
	eu.staff_id as staff_id,
	cs.TRANS_TYPE as trans_type,
	SUM(bop.PRODUCT_QTY) as product_quantity,
	COUNT(DISTINCT cs.ORDER_NO) as order_count
FROM CUSTOMER_SALES cs
JOIN BASKET_ORDER_PRODUCTS bop ON cs.NEO_SKU_ID = bop.PRODUCT_SKU
JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
AND eup.business_unit = 'MW'
AND cs.ORDER_DATE  >= '2019-01-01'
AND cs.ORDER_DATE  <= '2023-01-01'
GROUP BY eu.staff_id, cs.TRANS_TYPE

/* Clientele */

SELECT
	eu.staff_id as staff_id,
	cs.TRANS_TYPE as trans_type,
	SUM(bop.PRODUCT_QTY) as product_quantity,
	COUNT(DISTINCT cs.ORDER_NO) as order_count
FROM CUSTOMER_SALES cs
JOIN BASKET_ORDER_PRODUCTS bop ON cs.NEO_SKU_ID = bop.PRODUCT_SKU
JOIN STAFF_CUSTOMERS sc ON sc.CUSTOMER_VIP_NO = cs.VIP_NO
JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
AND eup.business_unit = 'MW'
AND cs.ORDER_DATE  >= '2019-01-01'
AND cs.ORDER_DATE  <= '2023-01-01'
AND sc.CUSTOMER_TYPE = 'Core'
GROUP BY eu.staff_id, cs.TRANS_TYPE

/* nonclientele = ALL - Clientele */
