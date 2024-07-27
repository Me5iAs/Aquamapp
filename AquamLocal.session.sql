WITH clienteconsumopromedio AS (
    SELECT 
        cc.Id AS IdCliente,
        AVG(consumosmensuales.MontoTotal) AS MontoPromedioMensual,
        (CASE 
            WHEN ((MAX(consumosmensuales.Cantidad) >= 5) AND (MAX(consumosmensuales.CantidadPaq) < 20)) THEN 'Minorista'
            WHEN ((MAX(consumosmensuales.Cantidad) < 5) AND (MAX(consumosmensuales.CantidadPaq) <= 10)) THEN 'Consumidor'
            ELSE 'Mayorista' 
        END) AS TipoCliente
    FROM (
        SELECT 
            pp.IdCliente AS Idcliente,
            YEAR(pp.FechaPide) AS Anio,
            pp.Cantidad AS Cantidad,
            pp.CantidadPaq AS CantidadPaq,
            MONTH(pp.FechaPide) AS Mes,
            SUM(
                (COALESCE(pp.Cantidad, 0) * COALESCE(pp.Precio, 0)) + 
                (COALESCE(pp.CantidadPaq, 0) * COALESCE(pp.PrecioPaq, 0))
            ) AS MontoTotal
        FROM pedidos pp
        JOIN clientes cc ON pp.IdCliente = cc.Id
        WHERE 
            pp.IdCliente <> 0 AND 
            pp.EstadoPedido = 1 AND 
            pp.FechaPide < DATE_FORMAT(NOW(), '%Y-%m-01') AND 
            pp.FechaPide >= DATE_FORMAT((NOW() - INTERVAL 2 YEAR), '%Y-%m-01') AND 
            cc.Estado = 1 AND 
            pp.Estado = 1
        GROUP BY pp.IdCliente, Anio, Mes
    ) consumosmensuales
    JOIN clientes cc ON consumosmensuales.Idcliente = cc.Id
    GROUP BY consumosmensuales.Idcliente
    ORDER BY IdCliente
), 
clientemetricas AS (
    SELECT 
        subquery.IdCliente AS IdCliente,
        subquery.Nombre AS Nombre,
        COUNT(p.Id) AS FrecuenciaCompra,
        SUM(IFNULL(p.Cantidad, 0)) AS TotalBotellones,
        SUM(IFNULL(p.CantidadPaq, 0)) AS TotalPaquetes,
        SUM(
            (IFNULL(p.Cantidad, 0) * IFNULL(p.Precio, 0)) + 
            (IFNULL(p.CantidadPaq, 0) * IFNULL(p.PrecioPaq, 0))
        ) AS MontoTotalCompra,
        MIN(p.FechaEntrega) AS PrimeraCompra,
        MAX(p.FechaEntrega) AS UltimaCompra,
        (TO_DAYS(CURDATE()) - TO_DAYS(MAX(p.FechaEntrega))) AS DiasDesdeUltimaCompra,
        MAX(TO_DAYS(p.FechaEntrega) - TO_DAYS(subquery.lag_fecha)) AS TiempoMaxEntreCompras,
        AVG(TO_DAYS(p.FechaEntrega) - TO_DAYS(subquery.lag_fecha)) AS TiempoPromedioEntreCompras,
        MAX(p.Cantidad) AS MaxBot,
        MAX(p.CantidadPaq) AS MaxPaq,
        IFNULL(AVG(CASE WHEN IFNULL(p.Cantidad, 0) > 0 THEN p.Cantidad ELSE NULL END), 0) AS PromedioBotellones,
        IFNULL(AVG(CASE WHEN IFNULL(p.CantidadPaq, 0) > 0 THEN p.CantidadPaq ELSE NULL END), 0) AS PromedioPaquetes,
        prom.MontoPromedioMensual AS MontoPromedioMensual,
        prom.TipoCliente AS TipoCliente,
        NTILE(5) OVER (PARTITION BY prom.TipoCliente ORDER BY prom.MontoPromedioMensual) AS percentile
    FROM (
        SELECT 
            c.Id AS IdCliente,
            c.Nombre AS Nombre,
            p.Id AS PedidoId,
            p.FechaEntrega AS FechaEntrega,
            LAG(p.FechaEntrega) OVER (PARTITION BY c.Id ORDER BY p.FechaEntrega) AS lag_fecha
        FROM clientes c
        JOIN pedidos p ON c.Id = p.IdCliente
        WHERE 
            c.Estado = 1 AND 
            c.Id <> 0 AND 
            p.FechaEntrega >= (CURDATE() - INTERVAL 2 YEAR)
    ) subquery
    JOIN pedidos p ON subquery.PedidoId = p.Id
    JOIN clienteconsumopromedio prom ON prom.IdCliente = subquery.IdCliente
    GROUP BY subquery.IdCliente, subquery.Nombre
    HAVING FrecuenciaCompra > 1
)

SELECT 
    cm.IdCliente AS IdCliente,
    cm.Nombre AS Nombre,
    cm.FrecuenciaCompra AS FrecuenciaCompra,
    cm.TotalBotellones AS TotalBotellones,
    cm.TotalPaquetes AS TotalPaquetes,
    cm.MontoTotalCompra AS MontoTotalCompra,
    cm.PrimeraCompra AS PrimeraCompra,
    cm.UltimaCompra AS UltimaCompra,
    (TO_DAYS(cm.UltimaCompra) - TO_DAYS(cm.PrimeraCompra)) AS tiempototal,
    cm.DiasDesdeUltimaCompra AS DiasDesdeUltimaCompra,
    cm.TiempoMaxEntreCompras AS TiempoMaxEntreCompras,
    ROUND(cm.TiempoPromedioEntreCompras, 2) AS TiempoPromedioEntreCompras,
    cm.MaxBot AS MaxBot,
    cm.MaxPaq AS MaxPaq,
    cm.PromedioBotellones AS PromedioBotellones,
    cm.PromedioPaquetes AS PromedioPaquetes,
    cm.MontoPromedioMensual AS MontoPromedioMensual,
    cm.TipoCliente AS TipoCliente,
    (CASE 
        WHEN cm.percentile = 1 THEN 'E'
        WHEN cm.percentile = 2 THEN 'D'
        WHEN cm.percentile = 3 THEN 'C'
        WHEN cm.percentile = 4 THEN 'B'
        ELSE 'A'
    END) AS Segmento,
    (CASE 
        WHEN cm.DiasDesdeUltimaCompra < cm.TiempoPromedioEntreCompras THEN 'Normal'
        WHEN cm.DiasDesdeUltimaCompra > cm.TiempoPromedioEntreCompras AND cm.DiasDesdeUltimaCompra < cm.TiempoMaxEntreCompras THEN 'Dudoso'
        WHEN cm.DiasDesdeUltimaCompra > cm.TiempoMaxEntreCompras AND cm.DiasDesdeUltimaCompra < (cm.TiempoMaxEntreCompras * 2) AND cm.DiasDesdeUltimaCompra > 20 THEN 'Riesgo'
        WHEN cm.DiasDesdeUltimaCompra > (cm.TiempoMaxEntreCompras * 2) AND cm.DiasDesdeUltimaCompra > 30 THEN 'Perdida'
        WHEN cm.DiasDesdeUltimaCompra < 30 THEN 'Dudoso'
        ELSE 'Riesgo'
    END) AS EstadoRecencia
FROM clientemetricas cm
where Idcliente = 11
;
