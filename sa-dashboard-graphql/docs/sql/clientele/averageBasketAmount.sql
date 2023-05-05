/*
Steps:
(1) get the business unit of the user
(2) use the query below to retrieve:-
	- staff_id of the specifed business unit
	- amount: average basket amount for each staff_id
(3) use the amount for individual metrics
(4) take the average (sum of all amount / staff count) to get the business average
*/

SELECT 
	eu.staff_id as staff_id,
	SUM(cs.AMT_HKD) / COUNT(DISTINCT cs.VIP_NO) as amount
FROM CUSTOMER_SALES cs
JOIN STAFF_CUSTOMERS sc ON sc.CUSTOMER_VIP_NO = cs.VIP_NO
JOIN ELLC_USERS eu ON eu.staff_id = sc.STAFF_ID
JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
AND eup.business_unit = 'MW'
AND cs.ORDER_DATE  >= '2022-11-01' 
AND cs.ORDER_DATE  <= '2023-01-01'
AND sc.CUSTOMER_TYPE = 'Core' /* this condition can be removed if querying all customers regardless of the customer type*/
GROUP BY eu.staff_id
