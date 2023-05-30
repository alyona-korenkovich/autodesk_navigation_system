import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ItemDto } from './dto/item.dto';
import { ItemsService } from './items.service';
import { UpdateItemDto } from './dto/update-item.dto';
import { TokenDto } from 'Dto/token.dto';
import { ProjectDto } from './dto/project.dto';

@Controller('/api/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.itemsService.findById(id);
  }

  @Get('project/:idProject')
  findItemsByProject(@Param('idProject') idProject: ItemDto) {
    return this.itemsService.findAllItemsByProject(idProject);
  }

  @Post('/')
  createItem(@Body() item: ItemDto) {
    return this.itemsService.createItem(item);
  }

  @Put('/')
  updateItem(@Body() body: UpdateItemDto) {
    return this.itemsService.updateItem(body._id, body.update_item);
  }

  @Delete('/:id')
  deleteItem(@Param('id') id: string) {
    return this.itemsService.deleteItem(id);
  }

  @Post('/init')
  initItems(@Req() req: TokenDto, @Body() project: ProjectDto) {
    return this.itemsService.initItems(
      req.oauth_token,
      project.urn,
      project.projectId,
    );
  }
}
