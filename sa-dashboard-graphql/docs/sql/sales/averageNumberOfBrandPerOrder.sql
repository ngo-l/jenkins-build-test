
/* 
steps: 
(1) get the business unit
(2) query output:
	- staff_id
	- number_of_brand_per_order
(3) pick the number_of_brand_per_order of the inputted staff_id for individual metrics
(4) sum up the number_of_brand_per_order and divide it by the number of staff to get the business average
*/

SELECT
	staff_id
	AVG(c) as number_of_brand_per_order
FROM (
	SELECT
		COUNT(pb.BRAND_CODE) as c,
		eu.staff_id as staff_id
	FROM CUSTOMER_SALES cs
	JOIN PB_INFO pi2 ON pi2.NEO_SKU_ID = cs.NEO_SKU_ID
	JOIN PRODUCT_BIBLE pb ON pb.LC_STYLE_CODE = pi2.LC_STYLE_CODE
	JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
	JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID 
	AND cs.TRANS_TYPE = '01'
	AND cs.ORDER_DATE >= '2022-01-01'
	AND cs.ORDER_DATE <= '2023-12-01'
	AND eup.business_unit  = 'MW'
	AND cs.ID not in (SELECT ID FROM CUSTOMER_SALES cs2 WHERE cs2.TRANS_TYPE = '02')
	GROUP BY eu.staff_id, cs.ORDER_NO
) t
GROUP BY staff_id
