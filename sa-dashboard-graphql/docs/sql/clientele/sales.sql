
/* individual */
SELECT 
    SUM(cs.AMT_HKD) as cusomter_sales_amount
FROM CUSTOMER_SALES cs 
JOIN STAFF_CUSTOMERS sc on sc.CUSTOMER_VIP_NO = cs.VIP_NO
JOIN ELLC_USERS eu on eu.staff_id = sc.STAFF_ID
WHERE eu.staff_id = '017888'
AND cs.ORDER_DATE  >= '2022-11-01' 
AND cs.ORDER_DATE  <= '2022-12-01' 
AND sc.CUSTOMER_TYPE = 'Core' /* this condition can be removed if querying all customers regardless of the customer type*/

/* get business unit */
SELECT 
	eup.business_unit as business_unit
FROM ELLC_USERS eu 
JOIN ELLC_USER_PROFILES eup on eu.ID = eup.user_id
WHERE eu.staff_id = '017888'

/* business average */

SELECT AVG(sales_amount_by_SA) as business_average
FROM (
	SELECT 
		SUM(cs.AMT_HKD) as sales_amount_by_SA
	FROM CUSTOMER_SALES cs
	JOIN STAFF_CUSTOMERS sc on sc.CUSTOMER_VIP_NO = cs.VIP_NO
	JOIN ELLC_USERS eu on eu.staff_id = sc.STAFF_ID
	JOIN ELLC_USER_PROFILES eup on eup.user_id = eu.ID
	WHERE eup.business_unit = 'MW'
	AND sc.CUSTOMER_TYPE = 'Core' /* this condition can be removed if querying all customers regardless of the customer type*/
	AND cs.ORDER_DATE  >= '2022-11-01' 
	AND cs.ORDER_DATE  <= '2022-12-01' 
	GROUP BY eu.staff_id
) t;