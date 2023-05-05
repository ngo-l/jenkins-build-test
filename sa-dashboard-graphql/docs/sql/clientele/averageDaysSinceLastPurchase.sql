
SELECT
	staff_id,
	AVG(diff) as days
FROM (
	SELECT
		eu.staff_id as staff_id,
		cs.VIP_NO as vip_no,
		DATEDIFF(CURDATE(), MAX(cs.ORDER_DATE)) as diff
	FROM CUSTOMER_SALES cs
	JOIN STAFF_CUSTOMERS sc ON cs.VIP_NO = sc.CUSTOMER_VIP_NO
	JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
	JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
	AND eup.business_unit = 'MW'
	AND cs.ORDER_DATE  >= '2022-11-01' 
	AND cs.ORDER_DATE  <= '2023-01-01' 
	AND sc.CUSTOMER_TYPE = 'Core' /* this condition can be removed if querying all customers regardless of the customer type */
	GROUP BY eu.staff_id, cs.VIP_NO
) as R
GROUP BY staff_id
