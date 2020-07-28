import "egg";
declare module "egg" {
  /** mysql 执行结果  */
  interface MysqlExecuteResult {
    /** 影响行数 */
    affectedRows: number;
    /**
     * 修改的行数,update 语句修改记录数,建议通过 `affectedRows` 字段判断执行结果
     */
    changedRows: number;
    /** 警告行数 */
    warningCount: number;
    /** 字段统计 ?? 不确定 */
    fieldCount: number;
    /** 添加id,可忽略 */
    insertId: number;
    /** 消息,可能报错时使用 */
    message: string;
    /** 某个不知名协议 */
    protocol41: boolean;
    /** 服务器状态 */
    serverStatus: number;
  }
  interface mysql {
    /**
     * 根据条件查询表内第一条数据
     *
     * @author Halo
     * @date 2020-07-29
     * @param {String} tableName 表名
     * @param {Record<string, any>} field 条件字段
     * @returns {(Promise<any | null>)}
     */
    get(tableName: String, field: Record<string, any>): Promise<any | null>;
    /**
     * 条件查询
     *
     * @author Halo
     * @date 2020-07-29
     * @param {string} tableName 表名
     * @param {({
     *         where: Record<string, any>; 经试验,where 参数只可做明确条件匹配
     *         orders?: Array<Array<string, string>>; 排序条件,格式 : [['id','asc'],['val','desc']...]
     *         -- 分页查询参数 --
     *         offset?: number; 数据偏移量
     *         limit?: number; 返回记录条数
     *       })} [option] 往上找到的资料来看,暂时只支持这4项条件,如果有新增,后续会进行补充
     * @returns {Promise<Array<any>>} 返回结果直接就是list,没有层级嵌套
     * @description 推测实现原理, 将where对象中参数拆分为[key]=value 写入 where 子句
     */
    select(
      tableName: string,
      option?: {
        where: Record<string, any>;
        orders?: Array<Array<string, string>>;
        offset?: number;
        limit?: number;
      }
    ): Promise<Array<any>>;

    /**
     * 执行sql语句
     *
     * @author Halo
     * @date 2020-07-29
     * @param {String} sql sql语句
     * @param {Array<any>} [values] 填充值 , 用来填充 sql语句中的 `?` 参数. 跟jdbc那种方式基本一致
     * @returns {(Promise<Array<any> | MysqlExecuteResult>)} 返回结果
     * @description
     * 1. 返回值根据查询或者增删改,会有两种返回值类型,使用时通过 as 区分结果
     * 2. 注意values要使用原始值,别传进去对象,解析不了的.
     */
    query(
      sql: String,
      values?: Array<any>
    ): Promise<Array<any> | MysqlExecuteResult>;

    /* 增删改部分 */

    /**
     * 添加/插入新数据
     *
     * @author Halo
     * @date 2020-07-29
     * @param {string} tableName 表名
     * @param {*} data 数据
     * @returns {Promise<MysqlExecuteResult>} mysql 执行结果
     * @description
     */
    insert(tableName: string, data: any): Promise<MysqlExecuteResult>;
    /**
     * 更新数据
     *
     * @author Halo
     * @date 2020-07-29
     * @param {string} tableName 表名
     * @param {*} data 数据
     * @returns {Promise<MysqlExecuteResult>} 执行结果
     * @description
     * 1. 执行结果建议通过影响行数判断是否成功
     * 2. 更新操作必须要指定 `主键` 否则报错
     * @throws 异常 - 1 : 如果没有加主键,会抛出一个 `{}` 空对象的异常
     */
    update(tableName: string, data: any): Promise<MysqlExecuteResult>;

    /**
     * 删除数据
     *
     * @author Halo
     * @date 2020-07-29
     * @param {string} tableName 表名
     * @param {*} data 删除条件
     * @returns {Promise<MysqlExecuteResult>} 执行结果
     */
    delete(tableName: string, data: any): Promise<MysqlExecuteResult>;

    /** 开启一个事务 */
    beginTransaction(): Promise<mysql>;

    /** 提交事务 */
    commit(): Promise<void>;

    /** 回滚事务 */
    rollback(): Promise<void>;
  }
  interface Application {
    mysql: mysql;
  }
}
