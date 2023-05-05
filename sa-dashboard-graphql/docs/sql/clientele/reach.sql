
/* individual */

SELECT
    COUNT(DISTINCT sci.CUSTOMER_VIP_NO) as 'count'
FROM STAFF_CUSTOMER_INTERACTIONS sci
JOIN STAFF_CUSTOMERS sc on sci.CUSTOMER_VIP_NO = sc.CUSTOMER_VIP_NO
JOIN ELLC_USERS eu on eu.staff_id = sci.STAFF_ID
JOIN ELLC_USER_PROFILES eup on eup.user_id = eu.ID
AND sc.CUSTOMER_TYPE = 'Core' /* this condition can be removed if querying all customers regardless of the customer type*/
AND sci.INTERACTED_AT  >= '2021-11-01' 
AND sci.INTERACTED_AT  <= '2022-12-01'
AND eu.staff_id = '017888'
GROUP BY eu.staff_id

/* business average */
SELECT AVG(customer_count) as business_average
FROM (
	SELECT
	    COUNT(DISTINCT sci.CUSTOMER_VIP_NO) as 'customer_count'
	FROM STAFF_CUSTOMER_INTERACTIONS sci
	JOIN STAFF_CUSTOMERS sc on sci.CUSTOMER_VIP_NO = sc.CUSTOMER_VIP_NO
	JOIN ELLC_USERS eu on eu.staff_id = sci.STAFF_ID
	JOIN ELLC_USER_PROFILES eup on eup.user_id = eu.ID
	AND sc.CUSTOMER_TYPE = 'Core' /* this condition can be removed if querying all customers regardless of the customer type*/
	AND sci.INTERACTED_AT  >= '2021-11-01' 
	AND sci.INTERACTED_AT  <= '2022-12-01'
	AND eup.business_unit = 'MW'
	GROUP BY eu.staff_id
) t;
