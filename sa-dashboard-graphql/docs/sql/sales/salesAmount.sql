/* ALL */

SELECT 
	AVG(amount)
FROM (
	SELECT 
	    COUNT(DISTINCT cs.ORDER_NO) as amount
	FROM CUSTOMER_SALES cs
	JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
	JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
    AND eup.business_unit = 'MW' /* get the business unit before making this query*/
	AND cs.TRANS_TYPE = '01'
	AND cs.ORDER_DATE  >= '2022-01-01' 
	AND cs.ORDER_DATE  <= '2023-01-01'
	GROUP BY cs.STAFF_ID
) as business_average

/* Clientele */
SELECT 
	AVG(amount)
FROM (
	SELECT 
		SUM(cs.AMT_HKD) as amount 
	FROM CUSTOMER_SALES cs
	JOIN STAFF_CUSTOMERS sc ON cs.VIP_NO = sc.CUSTOMER_VIP_NO
	JOIN ELLC_USERS eu ON eu.staff_id = sc.STAFF_ID
	JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
    AND eup.business_unit = 'MW' /* get the business unit before making this query*/
	AND cs.ORDER_DATE  >= '2022-01-01' 
    AND cs.ORDER_DATE  <= '2023-01-01'
	GROUP BY sc.STAFF_ID
) as business_average

/* nonclientele = all - clientele */
